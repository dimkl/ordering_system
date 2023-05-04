import type { Context, Next } from "koa";
import type { IncomingHttpHeaders } from "http";

import { constants } from "@clerk/backend";
import { clerkClient, clerkOptions } from "./clerkClient";

const getSingleValue = (value?: string[] | string): string | undefined => {
  return (Array.isArray(value) ? value[0] : value) || undefined;
};

const getOptionsFromHeaders = (headers: IncomingHttpHeaders) => {
  return {
    forwardedPort: getSingleValue(headers["x-forwarded-port"]),
    forwardedHost: getSingleValue(headers["x-forwarded-host"]),
    referrer: headers["referer"],
    userAgent: headers["user-agent"],
    origin: headers["origin"],
    host: headers["host"] as string,
  };
};

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
        ...clerkOptions,
        ...getOptionsFromHeaders(ctx.headers),
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
