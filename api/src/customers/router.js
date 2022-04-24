const Router = require('koa-router');

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

router.get('/customers', ListController);
router.get('/customers/:customer_id', ListController);
router.post('/customers', CreateController);
router.patch('/customers/:customer_id', UpdateController);
router.delete('/customers/:customer_id', DeleteController);

// actions
router.post('/customers/login', LoginController);
router.post('/customers/signup', SignupController);

module.exports = router;