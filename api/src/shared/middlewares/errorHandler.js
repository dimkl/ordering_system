const { ValidationError } = require("ajv");
const { NotFoundError } = require('objection');
const { UniqueViolationError } = require('objection-db-errors');
const { BusinessError } = require('../errors');

function errorHandler() {
  return async function errorHandlerMiddleware(ctx, next) {
    try {
      await next();
    } catch (err) {
      if (err instanceof ValidationError) {
        ctx.status = 400;
        ctx.body = err.errors;
      } else if (err instanceof UniqueViolationError) {
        ctx.status = 422;
        ctx.body = { message: `${err.columns.join(',')} already exists!` };
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
  }
}

module.exports = errorHandler;