const Router = require('koa-router');

const verifyToken = require('../shared/middlewares/verifyToken');
const authorize = require('../shared/middlewares/authorize');

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

router.param('order_id', loadOrder)
      .param('order_item_id', loadOrderItem);
router.use(verifyToken());

router.get('/orders', authorize('urn:orders:r'), ListController);
router.get('/orders/:order_id', authorize('urn:orders:r'), ListController);
router.post('/orders', authorize('urn:orders:c'), CreateController);
router.patch('/orders/:order_id', authorize('urn:orders:u'), UpdateController);
router.delete('/orders/:order_id', authorize('urn:orders:d'), DeleteController);
router.post('/orders/:order_id/:action', authorize('urn:orders:t'), TransitionController);

router.post('/order_items', authorize('urn:order_items:c'), AddOrderItemController);
router.post('/order_items/:order_item_id/:action', authorize('urn:order_items:t'), TransitionOrderItemController);
router.delete('/order_items/:order_item_id', authorize('urn:order_items:d'), RemoveOrderItemController);
router.patch('/order_items/:order_item_id', authorize('urn:order_items:u'), UpdateOrderItemController);

module.exports = router;
