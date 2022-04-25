const Router = require('koa-router');

const verifyToken = require('../shared/middlewares/verifyToken');
const authorize = require('../shared/middlewares/authorize');

const MenuController = require('./controllers/menu');
const ListController = require('./controllers/list');

const loadShop = require('./helpers/loadShop');

const router = new Router();

router.param('shop_id', loadShop);
router.use(verifyToken());

router.get('/shops/:shop_id/menu', authorize('urn:shops:m'), MenuController);
router.get('/shops', authorize('urn:shops:r'), ListController);
router.get('/shops/:shop_id', authorize('urn:products:r'), ListController);

module.exports = router;