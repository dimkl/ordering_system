const schema = require("../../schemas/slot.create.json");
const Slot = require("../../models/slot");
const Section = require("../../../shops/models/section");
const User = require("../../../users/models/user");

async function handler(ctx, next) {
  const data = ctx.request.validatedData;
  const slotId = await Section.getId(data.section_id);
  const userId = await User.getId(data.user_id);

  ctx.body = await Slot.query()
    .modify("publicInsertColumns")
    .insert({
      ...data,
      user_id: userId,
      slot_id: slotId,
    });
}

module.exports = { handler, schema };
