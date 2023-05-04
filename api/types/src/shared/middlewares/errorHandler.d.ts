import type { Context, Next } from "koa";
export declare function errorHandler(): (ctx: Context, next: Next) => Promise<void>;
