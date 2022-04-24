const Router = require('koa-router');

const verifyToken = require('../shared/middlewares/verifyToken');

const ListController = require('./controllers/list');
const CreateController = require('./controllers/create');
const UpdateController = require('./controllers/update');
const DeleteController = require('./controllers/delete');
const LoginController = require('./controllers/login');
const SignupController = require('./controllers/signup');

const loadCustomer = require('./helpers/loadCustomer');

const router = new Router();

// setup params
router.param('customer_id', loadCustomer);

router.get('/customers', verifyToken(), ListController);
router.get('/customers/:customer_id', verifyToken(), ListController);
router.post('/customers', verifyToken(), CreateController);
router.patch('/customers/:customer_id', verifyToken(), UpdateController);
router.delete('/customers/:customer_id', verifyToken(), DeleteController);

// actions
router.post('/customers/login', LoginController);
router.post('/customers/signup', SignupController);

module.exports = router;