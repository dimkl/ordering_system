import type { Context, Next } from "koa";

import { constants } from "@clerk/backend";
import { clerkClient, clerkOptions } from "./clerkClient";

export const verifyToken = () => {
  return async function verifyToken(ctx: Context, next: Next) {
    try {
      const authHeader = ctx.headers["authorization"] || "";
      const headerToken = authHeader.split("Bearer ")[1];
      const cookieToken = ctx.cookies.get(constants.Cookies.Session);
      const clientUat = ctx.cookies.get(constants.Cookies.ClientUat);

      const requestState = await clerkClient.authenticateRequest({
        cookieToken,
        headerToken,
        clientUat,
        origin: ctx.headers["origin"],
        host: ctx.headers["host"] as string,
        ...clerkOptions,
      });

      if (requestState.isUnknown) {
        ctx.response.headers = {
          [constants.Headers.AuthReason]: requestState.reason,
          [constants.Headers.AuthMessage]: requestState.message,
          [constants.Headers.AuthStatus]: requestState.status,
        };
        ctx.status = 401;
        return;
      }

      if (requestState.isInterstitial) {
        ctx.response.headers = {
          [constants.Headers.AuthReason]: requestState.reason,
          [constants.Headers.AuthMessage]: requestState.message,
          [constants.Headers.AuthStatus]: requestState.status,
          "content-type": "text/html",
        };

        const { publishableKey, frontendApi } = clerkOptions;
        ctx.body = clerkClient.localInterstitial({
          publishableKey,
          frontendApi,
        });
        ctx.status = 401;
        return;
      }

      ctx.auth = requestState.toAuth();

      return next();
    } catch (err) {
      // TODO: use logger
      console.error(err);
      ctx.status = 401;
    }
  };
};
