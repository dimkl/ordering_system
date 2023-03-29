const User = require("../../../users/models/user");
const Section = require("../../../shops/models/section");

const schema = require("../../schemas/slot.patch.json");

async function handler(ctx, next) {
  const data = ctx.request.validatedData;
  const userId = await User.getId(data.user_id);
  const sectionId = await Section.getId(data.section_id);

  if (Object.keys(data).length > 0) {
    await ctx.slot
      .$query()
      .patch({ ...data, section_id: sectionId, user_id: userId });
  }

  ctx.body = await ctx.slot.$query().modify("publicColumns");
}

module.exports = { handler, schema };
