const Router = require('koa-router');

const verifyToken = require('../shared/middlewares/verifyToken');
const authorize = require('../shared/middlewares/authorize');

const ProductListController = require('./controllers/products/list');
const ProductCreateController = require('./controllers/products/create');
const ProductAddIngredientController = require('./controllers/products/addIngredient');

const IngredientListController = require('./controllers/ingredients/list');
const IngredientCreateController = require('./controllers/ingredients/create');

const loadProduct = require('./helpers/loadProduct');
const loadIngredient = require('./helpers/loadIngredient');

const router = new Router();

// setup params
router.param('product_id', loadProduct)
  .param('ingredient_id', loadIngredient);
router.use(verifyToken());

router.post('/products/ingredients', authorize(['urn:products:c']), ProductAddIngredientController);

router.get('/products', authorize(['urn:products:r']), ProductListController);
router.get('/products/:product_id', authorize(['urn:products:r']), ProductListController);
router.post('/products', authorize(['urn:products:c']), ProductCreateController);

router.get('/ingredients', authorize(['urn:ingredients:r']), IngredientListController);
router.get('/ingredients/:ingredient_id', authorize(['urn:ingredients:r']), IngredientListController);
router.post('/ingredients', authorize(['urn:ingredients:c']), IngredientCreateController);

module.exports = router;