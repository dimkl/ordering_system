import type { Context, Next } from "koa";
import schema from "../../schemas/timeSlot.patch.json";
declare function handler(ctx: Context, _next: Next): Promise<void>;
export { schema, handler };
