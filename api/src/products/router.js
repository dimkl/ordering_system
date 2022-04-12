const Router = require('koa-router');

const setupDiscovery = require('../shared/setupDiscovery');

const ListController = require('./controllers/list');
const CreateController = require('./controllers/create');

const Product = require('./models/product');

const router = new Router();

// setup params
router
  .param('product_id', async (productId, ctx, next) => {
    ctx.product = await Product.findByIdOrUid(productId).modify('publicColumns');

    if (!ctx.product) return ctx.status = 404;

    return next();
  });

setupDiscovery(router, [
  ListController.schema,
  CreateController.schema,
]);

router.get('/products', ListController.handler);
router.get('/products/:product_id', ListController.handler);
router.post('/products', CreateController.handler);

module.exports = router;