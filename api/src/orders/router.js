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
const OrderItem = require('./models/orderItem');

const router = new Router();

// setup params
router
  .param('order_id', async (orderId, ctx, next) => {
    ctx.order = await Order.findByIdOrUid(orderId).modify('publicColumns');

    if (!ctx.order) return ctx.status = 404;

    return next();
  });
router
  .param('order_item_id', async (orderItemId, ctx, next) => {
    ctx.orderItem = await OrderItem.findByIdOrUid(orderItemId).modify('publicColumns');

    if (!ctx.orderItem) return ctx.status = 404;

    if (ctx.orderItem.order_id != ctx.order.id) {
      ctx.status = 400;
      ctx.body = { message: `Order item ${ctx.orderItem.id} does not belong to order ${ctx.order.id}` };
      return;
    }

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
router.get('/orders/:order_id', ListController.handler);
router.post('/orders', CreateController.handler);
router.patch('/orders/:order_id', UpdateController.handler);
router.delete('/orders/:order_id', DeleteController.handler);

// actions
router.post('/orders/:state', TransitionController.handler);
router.post('/orders/:order_id/order_items', AddOrderItemController.handler);
router.delete('/orders/:order_id/order_items/:order_item_id', RemoveOrderItemController.handler);
router.patch('/orders/:order_id/order_items/:order_item_id', UpdateOrderItemController.handler);

module.exports = router;
