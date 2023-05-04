import type { Context, Next } from "koa";
import schema from "../schemas/customer.patch.json";
declare const handler: (ctx: Context, next: Next) => Promise<void>;
export { schema, handler };
