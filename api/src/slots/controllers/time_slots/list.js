const TimeSlot = require('../../models/timeSlot');

const handler = async (ctx, next) => {
  if (ctx.timeSlot){
    ctx.body = ctx.timeSlot;  
    return next();
  }
  ctx.body = await TimeSlot.query().modify('publicColumns');
};

module.exports = handler ;