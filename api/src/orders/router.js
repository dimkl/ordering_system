const Router = require('koa-router');

const router = new Router();

// setup params
router
  .param('order', (orderId, ctx, next) => {
    ctx.order = {};

    if (!ctx.order) return ctx.status = 404;

    return next();
  });

// append schemas to /discovery, be used by SDK
router.get('/discovery', require('./controllers/discovery'));

router.get('/orders', require('./controllers/list'));
router.get('/orders/:order', require('./controllers/list'));
router.post('/orders', require('./controllers/create'));
router.patch('/orders/:order', require('./controllers/update'));
router.delete('/orders/:order', require('./controllers/delete'));

// actions
router.post('/orders/:state', require('./controllers/transition'));
router.post('/orders/:order/order_items/', require('./controllers/addOrderItem'));
router.delete('/orders/:order/order_items/:order_item', require('./controllers/removeOrderItem'));
router.patch('/orders/:order/order_items/:order_item', require('./controllers/updateOrderItem'));

module.exports = router;
