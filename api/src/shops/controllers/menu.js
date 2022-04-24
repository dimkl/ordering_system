const ajv = require('../../shared/ajv');

const schema = require('../schemas/shop.menu.json');

ajv.addSchema(schema);
ajv.validateSchema(schema);

const handler = async (ctx, next) => {
  ctx.body = await ctx.shop.$query().modify('availableProducts');
};

module.exports = handler;