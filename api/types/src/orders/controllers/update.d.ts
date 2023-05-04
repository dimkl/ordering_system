import type { Context, Next } from "koa";
import schema from "../schemas/order.patch.json";
declare const handler: (ctx: Context, _next: Next) => Promise<void>;
export { schema, handler };
