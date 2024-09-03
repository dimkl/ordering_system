import type { Context, Next } from "koa";

import { Shop } from "../models/shop";

export const handler = async (ctx: Context, next: Next) => {
  if (ctx.shop) {
    ctx.body = ctx.shop;
    return next();
  }
  ctx.body = await Shop.query().modify(["publicColumns", ...ctx.state.included]);
};

export const includedResources = ["slots"];
