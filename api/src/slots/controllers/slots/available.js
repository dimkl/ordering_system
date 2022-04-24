const Slot = require('../../models/slot');

const handler = async (ctx, next) => {
  if (ctx.slot) {
    ctx.body = ctx.slot;
    return next();
  }
  const startedAt = ctx.query.started_at || ctx.shop.openingDate(new Date()).toISOString();
  const defaultEndedAt = ctx.shop.closingDate(new Date(startedAt)).toISOString();
  const endedAt = ctx.query.ended_at || defaultEndedAt;

  ctx.body = await Slot.query()
    .modify(['publicColumns', 'active'])
    .modify('available', ctx.shop.id, startedAt, endedAt);
};

module.exports = handler;