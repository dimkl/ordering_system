import type { Context, Next } from "koa";
import schema from "../../schemas/timeSlot.reserve.json";
declare function handler(ctx: Context, next: Next): Promise<void>;
export { schema, handler };
