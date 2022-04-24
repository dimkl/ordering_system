const Router = require('koa-router');
const ajv = require('../shared/ajv');
const getPublicKey = require('../shared/getPublicKey');

const router = new Router();

router.get('/discovery', (ctx) => {
  const schemas = Object.keys(ajv.schemas)
    .filter(s => s.startsWith('/schemas/'))
    .map(s => ajv.getSchema(s).schema);

  ctx.body = { schemas, publicKey: getPublicKey() };
});

module.exports = router;