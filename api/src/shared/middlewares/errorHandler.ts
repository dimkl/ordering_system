import type { Context, Next } from "koa";

import { NotFoundError, ForeignKeyViolationError } from "objection";
import { UniqueViolationError } from "objection-db-errors";
import { BusinessError, RequestError } from "../errors";
import { debug } from "debug";

const errorDebug = debug("api:error");

export function errorHandler() {
  return async function errorHandlerMiddleware(ctx: Context, next: Next) {
    try {
      await next();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      } else if (err instanceof RequestError) {
        ctx.status = 400;
        ctx.body = err.message;
      } else if (err instanceof NotFoundError || err instanceof ForeignKeyViolationError) {
        ctx.status = 404;
      } else {
        ctx.status = 500;
        errorDebug("Error %o", err);
        ctx.body = { message: err.message };
      }
    }
  };
}
