const ajv = require('../../shared/ajv');
const { ValidationError } = require("ajv");
const { UniqueViolationError } = require('objection-db-errors');

const schema = require('../schemas/customer.patch.json');

ajv.validateSchema(schema);
const validate = ajv.compile(schema);

const handler = async (ctx, next) => {
  try {
    const data = await validate(ctx.request.body);

    await ctx.customer.$query().patch(data);
    ctx.body = ctx.customer;
  } catch (err) {
    debugger;
    if (err instanceof ValidationError) {
      ctx.status = 400;
      ctx.body = err.errors;
    } else if (err instanceof UniqueViolationError) {
      ctx.status = 422;
      ctx.body = { message: `${err.columns.join(',')} already exists!` };
    }
  }
};

module.exports = { handler, schema };
