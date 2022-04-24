const Router = require('koa-router');

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

router.get('/orders', ListController);
router.get('/orders/:order_id', ListController);
router.post('/orders', CreateController);
router.patch('/orders/:order_id', UpdateController);
router.delete('/orders/:order_id', DeleteController);
router.post('/orders/:order_id/:action', TransitionController);

router.post('/order_items', AddOrderItemController);
router.post('/order_items/:order_item_id/:action', TransitionOrderItemController);
router.delete('/order_items/:order_item_id', RemoveOrderItemController);
router.patch('/order_items/:order_item_id', UpdateOrderItemController);

module.exports = router;
