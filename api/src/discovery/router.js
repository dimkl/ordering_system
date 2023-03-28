const { DiscoveryApiFactory } = require("@dimkl/ajv-discovery-api");
const Router = require("koa-router");
const getPublicKey = require("../shared/getPublicKey");

const router = new Router();
const discoveryApi = DiscoveryApiFactory.getInstance();

router.get("/discovery", (ctx) => {
  ctx.body = { schemas: discoveryApi.getSchemas(), publicKey: getPublicKey() };
});

module.exports = router;
