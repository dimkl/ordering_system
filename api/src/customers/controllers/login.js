const { BusinessError } = require("../../shared/errors");

const schema = require("../schemas/customer.login.json");
const Customer = require("../models/customer");

const createJwt = require("../helpers/createJwt");

async function handler(ctx, next) {
  const { email, password } = ctx.request.validatedData;

  const customer = await Customer.query().where({ email }).first();
  const isPasswordValid = await customer.verifyPassword(password);

  if (!isPasswordValid) {
    throw new BusinessError(
      "Password or email is not valid. Please try again!"
    );
  }

  ctx.body = await createJwt(customer.uuid);
}

module.exports = { schema, handler };
