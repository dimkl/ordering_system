import Router from "koa-router";

import { createController, createAuthController } from "../shared/controller";

import * as menuControllerParams from "./controllers/menu";
import * as listControllerParams from "./controllers/list";
import * as createControllerParams from "./controllers/create";
import * as createSectionControllerParams from "./controllers/createSection";

import { loadShop } from "./helpers/loadShop";

export const router = new Router();

router.param("shop_id", loadShop);

router.get("/shops/:shop_id/menu", createController(menuControllerParams));
router.get("/shops", createAuthController(listControllerParams));
router.post("/shops", createAuthController(createControllerParams));
router.get("/shops/:shop_id", createAuthController(listControllerParams));

router.post("/sections", createAuthController(createSectionControllerParams));
