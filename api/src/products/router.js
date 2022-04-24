const Router = require('koa-router');

const verifyToken = require('../shared/middlewares/verifyToken');

const ListController = require('./controllers/list');
const CreateController = require('./controllers/create');

const loadProduct = require('./helpers/loadProduct');

const router = new Router();

// setup params
router.param('product_id', loadProduct);
router.use(verifyToken());

router.get('/products', ListController);
router.get('/products/:product_id', ListController);
router.post('/products', CreateController);

module.exports = router;