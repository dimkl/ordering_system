const schema = require('../../schemas/timeSlot.release.json');

const handler = async (ctx, next) => {
  try {
    await ctx.timeSlot.$query().delete();
    ctx.status = 204;
  } catch (err) {
    ctx.status = 422;
    ctx.body = { message: err.message };
  }
};

module.exports = handler;