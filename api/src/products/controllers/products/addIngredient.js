const ajv = require('../../../shared/ajv');

const schema = require('../../schemas/productIngredient.create.json');
const ProductIngredient = require('../../models/productIngredient');
const Product = require('../../models/product');

const loadProduct = require('../../helpers/loadProduct');
const loadIngredient = require('../../helpers/loadIngredient');

ajv.addSchema(schema);
ajv.validateSchema(schema);

async function handler(ctx, next) {
  const validate = ajv.compile(schema);

  const data = await validate(ctx.request.body);

  await loadProduct(data.product_id, ctx, () => { });
  await loadIngredient(data.ingredient_id, ctx, () => { });

  const insertData = {
    ...data,
    product_id: ctx.product.id,
    ingredient_id: ctx.ingredient.id
  };

  await ProductIngredient.query().insert(insertData);

  ctx.body = await Product.findWithIngredients(ctx.product.id);
};

module.exports = handler;
