import type { Context } from "koa";

export const handler = async (ctx: Context) => {
  try {
    await ctx.timeSlot.$query().delete();
    ctx.status = 204;
  } catch (err) {
    ctx.status = 422;
    ctx.body = { message: (err as Error).message };
  }
};
