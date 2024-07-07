import type { Context } from "koa";
import schema from "../schemas/shop.menu.json";

const handler = async (ctx: Context) => {
  ctx.body = await ctx.shop.$query().modify("availableProducts");
};

export { schema, handler };
