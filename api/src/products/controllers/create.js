const ajv = require('../../shared/ajv');

const schema = require('../schemas/product.create.json');
const Product = require('../models/product');

ajv.addSchema(schema);
ajv.validateSchema(schema);

async function handler(ctx, next) {
  const validate = ajv.compile(schema);

  const data = await validate(ctx.request.body);

  ctx.body = await Product.query().modify('publicInsertColumns').insert(data);
};

module.exports = handler;
