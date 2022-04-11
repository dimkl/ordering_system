const Router = require('koa-router');

const setupDiscovery = require('../shared/setupDiscovery');

const ListController = require('./controllers/list');
const CreateController = require('./controllers/create');
const UpdateController = require('./controllers/update');
const DeleteController = require('./controllers/delete');
const LoginController = require('./controllers/login');
const SignupController = require('./controllers/signup');

const router = new Router();

// setup params
router
  .param('customer', (customerId, ctx, next) => {
    ctx.customer = {};

    if (!ctx.customer) return ctx.status = 404;

    return next();
  });

setupDiscovery(router, [
  ListController.schema,
  CreateController.schema,
  UpdateController.schema,
  DeleteController.schema,
  LoginController.schema,
  SignupController.schema
].filter(s => !!s));

router.get('/customers', ListController.handler);
router.get('/customers/:customer', ListController.handler);
router.post('/customers', CreateController.handler);
router.patch('/customers/:customer', UpdateController.handler);
router.delete('/customers/:customer', DeleteController.handler);

// actions
router.post('/customers/login', LoginController.handler);
router.post('/customers/signup', SignupController.handler);

module.exports = router;