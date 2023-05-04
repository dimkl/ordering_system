import type { Context, Next } from "koa";
import schema from "../schemas/shop.menu.json";

const handler = async (ctx: Context, _next: Next) => {
  ctx.body = await ctx.shop.$query().modify("availableProducts");
};

export { schema, handler };
