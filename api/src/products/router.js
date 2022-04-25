const Router = require('koa-router');

const verifyToken = require('../shared/middlewares/verifyToken');
const authorize = require('../shared/middlewares/authorize');

const ListController = require('./controllers/list');
const CreateController = require('./controllers/create');

const loadProduct = require('./helpers/loadProduct');

const router = new Router();

// setup params
router.param('product_id', loadProduct);
router.use(verifyToken());

router.get('/products', authorize('urn:products:r'), ListController);
router.get('/products/:product_id', authorize('urn:products:r'), ListController);
router.post('/products', authorize('urn:products:c'), CreateController);

module.exports = router;