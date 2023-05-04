import type { Context, Next } from "koa";

export const handler = async (ctx: Context, next: Next) => {
  try {
    await ctx.order.$query().delete();
    ctx.status = 204;
  } catch (err: any) {
    ctx.status = 422;
    ctx.body = { message: err.message };
  }
};
