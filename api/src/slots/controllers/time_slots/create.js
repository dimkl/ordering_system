const ajv = require('../../../shared/ajv');
const { ValidationError } = require("ajv");
const { UniqueViolationError } = require('objection-db-errors');

const schema = require('../../schemas/timeSlot.create.json');
const TimeSlot = require('../../models/timeSlot');
const Slot = require('../../models/slot');
const Customer = require('../../../customers/models/customer');

ajv.addSchema(schema);
ajv.validateSchema(schema);

const handler = async (ctx, next) => {
  const validate = ajv.compile(schema);
  const requestBody = ctx.request.body;

  try {
    debugger;
    const data = await validate(requestBody);
    const customerId = await Customer.getId(requestBody.customer_id);
    const slotId = await Slot.getId(requestBody.slot_id);

    ctx.body = await TimeSlot.query().modify('publicInsertColumns').insert({ 
      ...data,
      customer_id: customerId,
      slot_id: slotId
    });
    // ctx.body = await TimeSlot.query().modify('publicColumns').findById(timeSlot.id);
  } catch (err) {
    if (err instanceof ValidationError) {
      ctx.status = 400;
      ctx.body = err.errors;
    } else if (err instanceof UniqueViolationError) {
      ctx.status = 422;
      ctx.body = { message: `${err.columns.join(',')} already exists!` };
    }
  }
};

module.exports = { handler, schema };
