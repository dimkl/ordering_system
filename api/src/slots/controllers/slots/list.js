const Slot = require('../../models/slot');

const handler = async (ctx, next) => {
  if (ctx.slot){
    ctx.body = ctx.slot;  
    return next();
  }
  ctx.body = await Slot.query().modify('publicColumns');
};

module.exports = handler ;