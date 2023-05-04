import type { Context, Next } from "koa";
import schema from "../schemas/customer.login.json";
declare const handler: (ctx: Context, next: Next) => Promise<void>;
export { schema, handler };
