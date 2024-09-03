import type { Context, Next, Middleware } from "koa";

import { AuthorizationError } from "../../errors";

const groupByResource = (scopes: string[]) => {
  return scopes.reduce((group: Record<string, string>, scope: string) => {
    const [, resource, actions] = scope.match(/urn:(\w+):(\w+|\*)/) || "";
    if (resource) {
      group[resource] = actions;
    }

    return group;
  }, {});
};

export const authorize = (requiredScopes: string[] = []): Middleware => {
  return async function authorize(ctx: Context, next: Next) {
    try {
      const scopes = process.env.MOCK_AUTH_REQUEST_SCOPES || "";

      const requiredGroupedResources = groupByResource(requiredScopes);
      const authorizedGroupedResources = groupByResource(scopes.split(" "));

      const isWildcardAuthorized = scopes == "*";
      const isWildcardPerResourceAuthorized = Object.keys(requiredGroupedResources).every(
        (r) => authorizedGroupedResources[r] === "*"
      );
      const isAuthorized = Object.entries(requiredGroupedResources).every(([r, actions]) =>
        actions.split("").every((a) => authorizedGroupedResources[r]?.includes(a))
      );

      if (isWildcardAuthorized || isWildcardPerResourceAuthorized || isAuthorized) return next();

      throw new AuthorizationError(`JWT is missing required scopes "${requiredScopes.join(",")}"!`);
    } catch (err) {
      ctx.status = 401;
    }
  };
};
