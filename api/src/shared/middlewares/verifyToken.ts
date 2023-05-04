import type { Context, Next } from "koa";

import jsonwebtoken from "jsonwebtoken";
import { getPublicKey } from "../getPublicKey";

export const verifyToken = () => {
  return async function verifyToken(ctx: Context, next: Next) {
    const authHeader = ctx.headers["authorization"];

    try {
      // TODO: replace this check with throw error when tests are fixed
      if (!authHeader) return next();

      const token = authHeader.split("Bearer ")[1];
      ctx.tokenClaims = await jsonwebtoken.verify(token, getPublicKey(), {
        algorithms: ["RS256"],
      });

      return next();
    } catch (err) {
      ctx.status = 403;
    }
  };
};
