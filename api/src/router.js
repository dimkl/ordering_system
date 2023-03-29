const Router = require('koa-router');

const router = new Router();

router.use(require('./customers/router').routes());
router.use(require('./orders/router').routes());
router.use(require('./products/router').routes());
router.use(require('./availability/router').routes());
router.use(require('./shops/router').routes());
router.use(require('./discovery/router').routes());

module.exports = router;