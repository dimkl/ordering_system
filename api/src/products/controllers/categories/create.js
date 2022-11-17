const ajv = require('../../../shared/ajv');

const schema = require('../../schemas/category.create.json');
const Category = require('../../models/category');

ajv.addSchema(schema);
ajv.validateSchema(schema);

async function handler(ctx, next) {
  const validate = ajv.compile(schema);

  const data = await validate(ctx.request.body);

  ctx.body = await Category.query().modify('publicInsertColumns').insert(data);
};

module.exports = handler;
