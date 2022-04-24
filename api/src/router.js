const Router = require('koa-router');
const ajv = require('./shared/ajv');

const router = new Router();

router.use(require('./customers/router').routes());
router.use(require('./orders/router').routes());
router.use(require('./products/router').routes());
router.use(require('./slots/router').routes());

router.get('/discovery', (ctx) => {
  ctx.body = Object.keys(ajv.schemas)
    .filter(s => s.startsWith('/schemas/'))
    .map(s => ajv.getSchema(s).schema);
});

module.exports = router;