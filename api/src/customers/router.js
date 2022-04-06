const Router = require('koa-router');

const router = new Router();

// setup params
router
  .param('customer', (customerId, ctx, next) => {
    ctx.customer = {};

    if (!ctx.customer) return ctx.status = 404;

    return next();
  });

// append schemas to /discovery, be used by SDK
router.get('/discovery', require('./controllers/discovery'));

router.get('/customers', require('./controllers/list'));
router.get('/customers/:customer', require('./controllers/list'));
router.post('/customers', require('./controllers/create'));
router.patch('/customers/:customer', require('./controllers/update'));
router.delete('/customers/:customer', require('./controllers/delete'));

// actions
router.post('/customers/login', require('./controllers/login'));
router.post('/customers/signup', require('./controllers/signup'));

module.exports = router;