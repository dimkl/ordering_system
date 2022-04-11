const DISCOVERY_ENDPOINT = '/discovery';

// append schemas to DISCOVERY_ENDPOINT (will be used by SDK)
const discoverHandler = (schemas) => async (ctx, next) => {
  ctx.body = [...(ctx.body || []), ...schemas];
  return next();
};

module.exports = function setupDiscovery(router, schemas) {
  router.get(DISCOVERY_ENDPOINT, discoverHandler(schemas));
}