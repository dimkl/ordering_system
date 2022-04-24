const fs = require('fs');
const Router = require('koa-router');
const ajv = require('./shared/ajv');

const router = new Router();

router.use(require('./customers/router').routes());
router.use(require('./orders/router').routes());
router.use(require('./products/router').routes());
router.use(require('./slots/router').routes());
router.use(require('./shops/router').routes());

const JWT_PUBLIC_KEY = process.env.JWT_PUBLIC_KEY || fs.readFileSync(__dirname + '/../config/public.pem');
router.get('/discovery', (ctx) => {
  const schemas = Object.keys(ajv.schemas)
    .filter(s => s.startsWith('/schemas/'))
    .map(s => ajv.getSchema(s).schema);

  ctx.body = { schemas, publicKey: JWT_PUBLIC_KEY };
});

module.exports = router;