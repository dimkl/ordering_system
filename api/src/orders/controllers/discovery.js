module.exports = async (ctx, next) => {
  ctx.body = ctx.body || [];
  console.log('discovery:orders')
  ctx.body.push({ schema: '2' });
  return next();
}