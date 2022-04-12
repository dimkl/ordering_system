const ajv = require('../../shared/ajv');
const { ValidationError } = require("ajv");
const { UniqueViolationError } = require('objection-db-errors');

const schema = require('../schemas/product.create.json');
const Product = require('../models/product');

ajv.addSchema(schema);
ajv.validateSchema(schema);

const handler = async (ctx, next) => {
  const validate = ajv.compile(schema);

  try {
    const data = await validate(ctx.request.body);

    const product = await Product.query().insert(data);

    ctx.body = await Product.query().modify('publicColumns').findById(product.id);
  } catch (err) {
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
