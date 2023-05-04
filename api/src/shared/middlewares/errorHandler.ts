import type { Context, Next } from "koa";

import { NotFoundError } from "objection";
import { UniqueViolationError } from "objection-db-errors";
import { BusinessError } from "../errors";

export function errorHandler() {
  return async function errorHandlerMiddleware(ctx: Context, next: Next) {
    try {
      await next();
    } catch (err: any) {
      if (err?.validation) {
        ctx.status = 400;
        ctx.body = err.errors;
      } else if (err instanceof UniqueViolationError) {
        ctx.status = 422;
        ctx.body = { message: `${err.columns.join(",")} already exists!` };
      } else if (err instanceof BusinessError) {
        ctx.status = 422;
        ctx.body = { message: err.message };
      } else if (err instanceof NotFoundError) {
        ctx.status = 404;
      } else {
        ctx.status = 500;
        ctx.body = { message: err.message };
      }
    }
  };
}
