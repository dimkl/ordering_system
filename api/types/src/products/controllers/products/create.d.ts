import type { Context, Next } from "koa";
import schema from "../../schemas/product.create.json";
declare const handler: (ctx: Context, _next: Next) => Promise<void>;
export { schema, handler };
