import { debug } from "debug";
import type { Context } from "koa";

const debugLog = debug("api:error");

export const cors = (origins: string[]) => {
  return (ctx: Context, next) => {
    const origin = ctx.headers["origin"] || "";

    debugLog("cors: allowed %o vs current %o", origins, origin);

    if (!origins.includes(origin)) {
      return;
    }

    ctx.set("Access-Control-Allow-Origin", origin);
    ctx.set("Access-Control-Allow-Methods", "GET,HEAD,POST,PUT,PATCH");
    ctx.set("Access-Control-Allow-Headers", "content-type,authorization");
    ctx.set("Access-Control-Allow-Credentials", "true");

    if (ctx.request.method.toLocaleLowerCase() === "options") {
      debugLog("passed as options!");
      ctx.status = 200;
      return;
    }

    return next();
  };
};
