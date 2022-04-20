const ajv = require('../../../shared/ajv');
const { ValidationError } = require("ajv");
const { UniqueViolationError } = require('objection-db-errors');

const schema = require('../../schemas/slot.create.json');
const Slot = require('../../models/slot');
const Section = require('../../../shops/models/section');
const User = require('../../../users/models/user');

ajv.addSchema(schema);
ajv.validateSchema(schema);

const handler = async (ctx, next) => {
  const validate = ajv.compile(schema);
  const requestBody = ctx.request.body;

  try {
    const data = await validate(requestBody);
    const slotId = await Section.getId(requestBody.section_id);
    const userId = await User.getId(requestBody.user_id);

    ctx.body = await Slot.query().modify('publicInsertColumns').insert({ 
      ...data,
      user_id: userId,
      slot_id: slotId
    });
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
