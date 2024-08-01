import Router from "koa-router";

import { createController } from "../shared/controller";

import * as menuControllerParams from "./controllers/menu";
import * as listControllerParams from "./controllers/list";

import { loadShop } from "./helpers/loadShop";

export const router = new Router();

router.param("shop_id", loadShop);

router.get("/shops/:shop_id/menu", createController(menuControllerParams));
router.get("/shops", createController(listControllerParams));
router.get("/shops/:shop_id", createController(listControllerParams));
