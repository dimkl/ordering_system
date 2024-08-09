import Router from "koa-router";

import { createAuthController } from "../shared/controller";

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

router.get("/orders", createAuthController(listControllerParams));
router.get("/orders/:order_id", createAuthController(listControllerParams));
router.post("/orders", createAuthController(createControllerParams));
router.patch("/orders/:order_id", createAuthController(updateControllerParams));
router.delete("/orders/:order_id", createAuthController(deleteControllerParams));
router.post("/orders/:order_id/:action", createAuthController(transitionControllerParams));

router.post("/order_items", createAuthController(addOrderItemControllerParams));
router.post(
  "/order_items/:order_item_id/:action",
  createAuthController(transitionOrderItemControllerParams)
);
router.delete("/order_items/:order_item_id", createAuthController(removeOrderItemControllerParams));
router.patch("/order_items/:order_item_id", createAuthController(updateOrderItemControllerParams));
