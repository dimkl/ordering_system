const ajv = require('../../../shared/ajv');

const User = require('../../../users/models/user');
const Section = require('../../../shops/models/section');

const schema = require('../../schemas/slot.patch.json');

ajv.addSchema(schema);
ajv.validateSchema(schema);

async function handler(ctx, next) {
  const validate = ajv.compile(schema);
  const requestBody = ctx.request.body;

  const userId = await User.getId(requestBody.user_id)
  const sectionId = await Section.getId(requestBody.section_id)

  const data = await validate(requestBody);

  if (Object.keys(data).length > 0) {
    await ctx.slot.$query().patch({ ...data, section_id: sectionId, user_id: userId });
  }

  ctx.body = await ctx.slot.$query().modify('publicColumns');
}

module.exports = { handler, schema };
