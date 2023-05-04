import type { Context, Next } from "koa";
import schema from "../../schemas/slot.create.json";
declare const handler: (ctx: Context, next: Next) => Promise<void>;
export { handler, schema };
