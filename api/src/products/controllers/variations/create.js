const ajv = require('../../../shared/ajv');

const schema = require('../../schemas/variation.create.json');
const Product = require('../../models/product');

const loadProduct = require('../../helpers/loadProduct');

ajv.addSchema(schema);
ajv.validateSchema(schema);

async function handler(ctx, next) {
  const validate = ajv.compile(schema);

  const data = await validate(ctx.request.body);
  await loadProduct(data.variant_id, ctx, () => { });

  const insertData = { ...data, variant_id: ctx.product.id };

  // TODO: validate that product should NOT be a variant
  // TODO: validate that at least 1 ingredient exists in variant

  const variation = await Product.query().modify('publicInsertColumns').insert(insertData);
  ctx.body = await Product.findVariationsWithIngredients(variation.variant_id);
};

module.exports = handler;
