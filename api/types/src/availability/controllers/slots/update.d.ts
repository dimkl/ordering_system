import type { Context, Next } from "koa";
import schema from "../../schemas/slot.patch.json";
declare const handler: (ctx: Context, _next: Next) => Promise<void>;
export { handler, schema };
