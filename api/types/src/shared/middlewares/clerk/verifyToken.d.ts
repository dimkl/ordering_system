import type { Context, Next } from "koa";
export declare const verifyToken: () => (ctx: Context, next: Next) => Promise<any>;
