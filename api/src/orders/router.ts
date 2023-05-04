import Router from "koa-router";

import { ControllerFactory } from "../shared/controllerFactory";

import { loadOrderItem } from "./helpers/loadOrderItem";
import { loadOrder } from "./helpers/loadOrder";

import * as listController from "./controllers/list";
import * as createController from "./controllers/create";
import * as updateController from "./controllers/update";
import * as deleteController from "./controllers/delete";
import * as transitionController from "./controllers/transition";
import * as addOrderItemController from "./controllers/addOrderItem";
import * as removeOrderItemController from "./controllers/removeOrderItem";
import * as updateOrderItemController from "./controllers/updateOrderItem";
import * as transitionOrderItemController from "./controllers/transitionOrderItem";

export const router = new Router();

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
