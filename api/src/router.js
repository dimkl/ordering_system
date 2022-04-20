const Router = require('koa-router');
const router = new Router();

router.use(require('./customers/router').routes());
router.use(require('./orders/router').routes());
router.use(require('./products/router').routes());
router.use(require('./slots/router').routes());

module.exports = router;