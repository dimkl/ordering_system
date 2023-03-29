const Router = require("koa-router");

const ControllerFactory = require("../shared/controllerFactory");

const loadOrderItem = require("./helpers/loadOrderItem");
const loadOrder = require("./helpers/loadOrder");

const listController = require("./controllers/list");
const createController = require("./controllers/create");
const updateController = require("./controllers/update");
const deleteController = require("./controllers/delete");
const transitionController = require("./controllers/transition");
const addOrderItemController = require("./controllers/addOrderItem");
const removeOrderItemController = require("./controllers/removeOrderItem");
const updateOrderItemController = require("./controllers/updateOrderItem");
const transitionOrderItemController = require("./controllers/transitionOrderItem");

const router = new Router();

router.param("order_id", loadOrder).param("order_item_id", loadOrderItem);

router.get(
  "/orders",
  ControllerFactory.create({
    ...listController,
    scopes: ["urn:orders:r"],
  })
);
router.get(
  "/orders/:order_id",
  ControllerFactory.create({
    ...listController,
    scopes: ["urn:orders:r"],
  })
);
router.post(
  "/orders",
  ControllerFactory.create({
    ...createController,
    scopes: ["urn:orders:c"],
  })
);
router.patch(
  "/orders/:order_id",
  ControllerFactory.create({
    ...updateController,
    scopes: ["urn:orders:u"],
  })
);
router.delete(
  "/orders/:order_id",
  ControllerFactory.create({
    ...deleteController,
    scopes: ["urn:orders:d"],
  })
);
router.post(
  "/orders/:order_id/:action",
  ControllerFactory.create({
    ...transitionController,
    scopes: ["urn:orders:t"],
  })
);

router.post(
  "/order_items",
  ControllerFactory.create({
    ...addOrderItemController,
    scopes: ["urn:order_items:c"],
  })
);
router.post(
  "/order_items/:order_item_id/:action",
  ControllerFactory.create({
    ...transitionOrderItemController,
    scopes: ["urn:order_items:t"],
  })
);
router.delete(
  "/order_items/:order_item_id",
  ControllerFactory.create({
    ...removeOrderItemController,
    scopes: ["urn:order_items:d"],
  })
);
router.patch(
  "/order_items/:order_item_id",
  ControllerFactory.create({
    ...updateOrderItemController,
    scopes: ["urn:order_items:u"],
  })
);

module.exports = router;
