const Router = require('koa-router');

const setupDiscovery = require('../shared/setupDiscovery');

const ListController = require('./controllers/list');
const CreateController = require('./controllers/create');
const UpdateController = require('./controllers/update');
const DeleteController = require('./controllers/delete');
const TransitionController = require('./controllers/transition');
const AddOrderItemController = require('./controllers/addOrderItem');
const RemoveOrderItemController = require('./controllers/removeOrderItem');
const UpdateOrderItemController = require('./controllers/updateOrderItem');

const Order = require('./models/order');

const router = new Router();

// setup params
router
  .param('order', async (orderId, ctx, next) => {
    ctx.order = await Order.query().modify('publicColumns').findById(orderId);

    if (!ctx.order) return ctx.status = 404;

    return next();
  });

setupDiscovery(router, [
  ListController.schema,
  CreateController.schema,
  UpdateController.schema,
  DeleteController.schema,
  TransitionController.schema,
  AddOrderItemController.schema,
  RemoveOrderItemController.schema,
  UpdateOrderItemController.schema
]);

router.get('/orders', ListController.handler);
router.get('/orders/:order', ListController.handler);
router.post('/orders', CreateController.handler);
router.patch('/orders/:order', UpdateController.handler);
router.delete('/orders/:order', DeleteController.handler);

// actions
router.post('/orders/:state', TransitionController.handler);
router.post('/orders/:order/order_items/', AddOrderItemController.handler);
router.delete('/orders/:order/order_items/:order_item', RemoveOrderItemController.handler);
router.patch('/orders/:order/order_items/:order_item', UpdateOrderItemController.handler);

module.exports = router;
