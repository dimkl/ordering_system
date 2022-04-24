const ajv = require('../../../shared/ajv');

const schema = require('../../schemas/slot.create.json');
const Slot = require('../../models/slot');
const Section = require('../../../shops/models/section');
const User = require('../../../users/models/user');

ajv.addSchema(schema);
ajv.validateSchema(schema);

async function handler(ctx, next) {
  const validate = ajv.compile(schema);
  const requestBody = ctx.request.body;

  const data = await validate(requestBody);
  const slotId = await Section.getId(requestBody.section_id);
  const userId = await User.getId(requestBody.user_id);

  ctx.body = await Slot.query().modify('publicInsertColumns').insert({
    ...data,
    user_id: userId,
    slot_id: slotId
  });
}

module.exports = handler;
