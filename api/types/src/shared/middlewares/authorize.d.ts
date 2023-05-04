import type { Context, Next } from "koa";
export declare const authorize: (requiredScopes?: string[]) => (ctx: Context, next: Next) => Promise<any>;
