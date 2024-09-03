import type { Context, Next, Middleware } from "koa";
import { getAuth, requireAuth } from "@dimkl/clerk-koa";
import compose from "koa-compose";
import { debug } from "debug";

import { AuthorizationError } from "../../errors";

const debugLog = debug("api:clerk:authorize");

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
  async function authorize(ctx: Context, next: Next) {
    try {
      if (!getAuth(ctx)) {
        throw new AuthorizationError("authorization is not loaded!");
      }

      if (!getAuth(ctx).sessionId) {
        throw new AuthorizationError("user is signedOut!");
      }

      if (!requiredScopes.length) {
        return next();
      }

      const scopes = ctx.auth.sessionClaims?.scopes;

      const requiredGroupedResources = groupByResource(requiredScopes);
      const authorizedGroupedResources = groupByResource(scopes.split(" "));

      const isWildcardAuthorized = scopes == "*";
      const isWildcardPerResourceAuthorized = Object.keys(requiredGroupedResources).every(
        (r) => authorizedGroupedResources[r] === "*"
      );
      const isAuthorized = Object.entries(requiredGroupedResources).every(([r, actions]) =>
        actions.split("").every((a) => authorizedGroupedResources[r].includes(a))
      );

      if (isWildcardAuthorized || isWildcardPerResourceAuthorized || isAuthorized) return next();

      throw new AuthorizationError(`JWT is missing required scopes "${requiredScopes.join(",")}"!`);
    } catch (err: unknown) {
      debugLog("AuthorizationError: %o", err);
      ctx.body = { message: (err as Error).message };
      ctx.status = 401;
    }
  }

  return compose([requireAuth(), authorize]) as Middleware;
};
