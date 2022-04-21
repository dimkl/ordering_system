const Router = require('koa-router');

const setupDiscovery = require('../shared/setupDiscovery');

const loadOrderItem = require('./helpers/loadOrderItem');
const loadOrder = require('./helpers/loadOrder');

const ListController = require('./controllers/list');
const CreateController = require('./controllers/create');
const UpdateController = require('./controllers/update');
const DeleteController = require('./controllers/delete');
const TransitionController = require('./controllers/transition');
const AddOrderItemController = require('./controllers/addOrderItem');
const RemoveOrderItemController = require('./controllers/removeOrderItem');
const UpdateOrderItemController = require('./controllers/updateOrderItem');
const TransitionOrderItemController = require('./controllers/transitionOrderItem');

const router = new Router();

// setup params
router.param('order_id', loadOrder)
      .param('order_item_id', loadOrderItem);

setupDiscovery(router, [
  ListController.schema,
  CreateController.schema,
  UpdateController.schema,
  DeleteController.schema,
  TransitionController.schema,
  AddOrderItemController.schema,
  RemoveOrderItemController.schema,
  UpdateOrderItemController.schema,
  TransitionOrderItemController.schema
]);

router.get('/orders', ListController.handler);
router.get('/orders/:order_id', ListController.handler);
router.post('/orders', CreateController.handler);
router.patch('/orders/:order_id', UpdateController.handler);
router.delete('/orders/:order_id', DeleteController.handler);
router.post('/orders/:order_id/:state', TransitionController.handler);

router.post('/order_items', AddOrderItemController.handler);
router.post('/order_items/:order_item_id/:state', TransitionOrderItemController.handler);
router.delete('/order_items/:order_item_id', RemoveOrderItemController.handler);
router.patch('/order_items/:order_item_id', UpdateOrderItemController.handler);

module.exports = router;
