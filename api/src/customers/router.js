const Router = require('koa-router');

const verifyToken = require('../shared/middlewares/verifyToken');
const authorize = require('../shared/middlewares/authorize');

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

router.get('/customers', verifyToken(), authorize(['urn:customers:r']), ListController);
router.get('/customers/:customer_id', verifyToken(), authorize(['urn:customers:r']), ListController);
router.post('/customers', verifyToken(), authorize(['urn:customers:c']), CreateController);
router.patch('/customers/:customer_id', verifyToken(), authorize(['urn:customers:u']), UpdateController);
router.delete('/customers/:customer_id', verifyToken(), authorize(['urn:customers:d']), DeleteController);

// actions
router.post('/customers/login', LoginController);
router.post('/customers/signup', SignupController);

module.exports = router;