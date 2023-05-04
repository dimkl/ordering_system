import schema from "../schemas/order.transition.json";
import type { Context, Next } from "koa";
declare const handler: (ctx: Context, next: Next) => Promise<void>;
export { schema, handler };
