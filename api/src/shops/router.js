const Router = require('koa-router');

const MenuController = require('./controllers/menu');
const ListController = require('./controllers/list');

const loadShop = require('./helpers/loadShop');

const router = new Router();

router.param('shop_id', loadShop);

router.get('/shops/:shop_id/menu', MenuController);
router.get('/shops', ListController);
router.get('/shops/:shop_id', ListController);

module.exports = router;