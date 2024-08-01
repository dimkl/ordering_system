import Router from "koa-router";

import { createController } from "../shared/controller";

import { loadOrderItem } from "./helpers/loadOrderItem";
import { loadOrder } from "./helpers/loadOrder";

import * as listControllerParams from "./controllers/list";
import * as createControllerParams from "./controllers/create";
import * as updateControllerParams from "./controllers/update";
import * as deleteControllerParams from "./controllers/delete";
import * as transitionControllerParams from "./controllers/transition";
import * as addOrderItemControllerParams from "./controllers/addOrderItem";
import * as removeOrderItemControllerParams from "./controllers/removeOrderItem";
import * as updateOrderItemControllerParams from "./controllers/updateOrderItem";
import * as transitionOrderItemControllerParams from "./controllers/transitionOrderItem";

export const router = new Router();

router.param("order_id", loadOrder).param("order_item_id", loadOrderItem);

router.get(
  "/orders",
  createController({
    ...listControllerParams,
    scopes: ["urn:orders:r"]
  })
);
router.get(
  "/orders/:order_id",
  createController({
    ...listControllerParams,
    scopes: ["urn:orders:r"]
  })
);
router.post("/orders", createController(createControllerParams));
router.patch(
  "/orders/:order_id",
  createController({
    ...updateControllerParams,
    scopes: ["urn:orders:u"]
  })
);
router.delete(
  "/orders/:order_id",
  createController({
    ...deleteControllerParams,
    scopes: ["urn:orders:d"]
  })
);
router.post(
  "/orders/:order_id/:action",
  createController({
    ...transitionControllerParams,
    scopes: ["urn:orders:t"]
  })
);

router.post(
  "/order_items",
  createController({
    ...addOrderItemControllerParams,
    scopes: ["urn:order_items:c"]
  })
);
router.post(
  "/order_items/:order_item_id/:action",
  createController({
    ...transitionOrderItemControllerParams,
    scopes: ["urn:order_items:t"]
  })
);
router.delete(
  "/order_items/:order_item_id",
  createController({
    ...removeOrderItemControllerParams,
    scopes: ["urn:order_items:d"]
  })
);
router.patch(
  "/order_items/:order_item_id",
  createController({
    ...updateOrderItemControllerParams,
    scopes: ["urn:order_items:u"]
  })
);
