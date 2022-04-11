const ajv = require('../../shared/ajv');

const schema = require('../schemas/customer.json');
const Customer = require('../models/customer');

ajv.validateSchema(schema);
const validate = ajv.compile(schema);

module.exports = async (ctx, next) => {
  try {
    const data = await validate(ctx.request.body);

    const customer = await Customer.query().insert(data);
    
    ctx.body = await Customer.query().modify('publicColumns').findById(customer.id);
  } catch (err) {
    console.error(err);

    ctx.body = err.errors;
    ctx.status = 422;
  }
}