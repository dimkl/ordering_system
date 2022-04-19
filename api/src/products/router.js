const Router = require('koa-router');

const setupDiscovery = require('../shared/setupDiscovery');

const ListController = require('./controllers/list');
const CreateController = require('./controllers/create');

const loadProduct = require('./helpers/loadProduct');

const router = new Router();

// setup params
router.param('product_id', loadProduct);

setupDiscovery(router, [
  ListController.schema,
  CreateController.schema,
]);

router.get('/products', ListController.handler);
router.get('/products/:product_id', ListController.handler);
router.post('/products', CreateController.handler);

module.exports = router;