module.exports = async (ctx, next) => {
  ctx.body = ctx.body || [];
  console.log('discovery:customers')
  ctx.body.push({ schema: '1' });
  return next();
}