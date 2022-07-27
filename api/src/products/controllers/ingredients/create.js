const ajv = require('../../../shared/ajv');

const schema = require('../../schemas/ingredient.create.json');
const Ingredient = require('../../models/ingredient');

ajv.addSchema(schema);
ajv.validateSchema(schema);

async function handler(ctx, next) {
  const validate = ajv.compile(schema);

  const data = await validate(ctx.request.body);

  ctx.body = await Ingredient.query().modify('publicInsertColumns').insert(data);
};

module.exports = handler;
