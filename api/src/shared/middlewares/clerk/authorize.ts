import type { Context, Next } from "koa";

import { AuthorizationError } from "../../errors";

const groupByResource = (scopes: string[]) => {
  return scopes.reduce((group: Record<string, string>, scope: string) => {
    const [_, resource, actions] = scope.match(/urn:(\w+):(\w+|\*)/) || "";
    if (resource) {
      group[resource] = actions;
    }

    return group;
  }, {});
};

export const authorize = (requiredScopes: string[] = []) => {
  return async function authorize(ctx: Context, next: Next) {
    try {
      if (!ctx.auth) {
        throw new AuthorizationError("authorization is not loaded!");
      }

      if (!ctx.auth.sessionId) {
        throw new AuthorizationError("user is signedOut!");
      }
      const scopes = ctx.auth.sessionClaims?.scopes;

      const requiredGroupedResources = groupByResource(requiredScopes);
      const authorizedGroupedResources = groupByResource(scopes.split(" "));

      const isWildcardAuthorized = scopes == "*";
      const isWildcardPerResourceAuthorized = Object.keys(
        requiredGroupedResources
      ).every((r) => authorizedGroupedResources[r] === "*");
      const isAuthorized = Object.entries(requiredGroupedResources).every(
        ([r, actions]) =>
          actions
            .split("")
            .every((a) => authorizedGroupedResources[r].includes(a))
      );

      if (
        isWildcardAuthorized ||
        isWildcardPerResourceAuthorized ||
        isAuthorized
      )
        return next();

      throw new AuthorizationError(
        `JWT is missing required scopes "${requiredScopes.join(",")}"!`
      );
    } catch (err) {
      ctx.status = 401;
    }
  };
};
