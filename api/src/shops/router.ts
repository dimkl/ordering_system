import Router from "koa-router";

import { ControllerFactory } from "../shared/controllerFactory";

import * as menuController from "./controllers/menu";
import * as listController from "./controllers/list";

import { loadShop } from "./helpers/loadShop";

export const router = new Router();

router.param("shop_id", loadShop);

router.get("/shops/:shop_id/menu", ControllerFactory.create(menuController));
router.get("/shops", ControllerFactory.create(listController));
router.get("/shops/:shop_id", ControllerFactory.create(listController));
