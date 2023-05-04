import type { Context, Next } from "koa";
import schema from "../schemas/orderItem.patch.json";
declare const handler: (ctx: Context, _next: Next) => Promise<void>;
export { schema, handler };
