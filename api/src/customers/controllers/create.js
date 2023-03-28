const schema = require("../schemas/customer.create.json");
const Customer = require("../models/customer");

async function handler(ctx, next) {
  const customer = await Customer.query().insert(ctx.request.validatedData);
  ctx.body = await Customer.query()
    .modify("publicColumns")
    .findById(customer.id);
}

module.exports = {
  schema,
  handler,
};
