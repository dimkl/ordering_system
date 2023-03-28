const schema = require("../schemas/customer.signup.json");
const Customer = require("../models/customer");

const createJwt = require("../helpers/createJwt");

async function handler(ctx, next) {
  const { repeat_password, ...data } = ctx.request.validatedData;

  const { uuid } = await Customer.query()
    .modify("publicInsertColumns")
    .insert(data);

  ctx.body = await createJwt(uuid);
}

module.exports = { schema, handler };
