import type { Context, Next } from "koa";

export const handler = async (ctx: Context, _next: Next) => {
  try {
    await ctx.timeSlot.$query().delete();
    ctx.status = 204;
  } catch (err: any) {
    ctx.status = 422;
    ctx.body = { message: err.message };
  }
};
