import Router from "koa-router";

import { createController, createAuthController } from "../shared/controller";

import { loadTimeSlot } from "./helpers/loadTimeSlot";
import { loadSlot } from "./helpers/loadSlot";
import { loadShop } from "./helpers/loadShop";

import * as timeSlotListControllerParams from "./controllers/time_slots/list";
import * as timeSloCreateControllerParams from "./controllers/time_slots/create";
import * as timeSlotUpdateControllerParams from "./controllers/time_slots/update";
import * as timeSlotReleaseControllerParams from "./controllers/time_slots/release";
import * as timeSlotAvailableControllerParams from "./controllers/time_slots/available";

import * as slotAvailableControllerParams from "./controllers/slots/available";
import * as slotCreateControllerParams from "./controllers/slots/create";
import * as slotUpdateControllerParams from "./controllers/slots/update";
import * as slotDeleteControllerParams from "./controllers/slots/delete";

export const router = new Router();

// setup params
router.param("time_slot_id", loadTimeSlot).param("slot_id", loadSlot).param("shop_id", loadShop);

router.get("/time_slots", createAuthController(timeSlotListControllerParams));
router.post("/time_slots", createAuthController(timeSloCreateControllerParams));
router.get("/time_slots/:time_slot_id", createAuthController(timeSlotListControllerParams));
router.patch("/time_slots/:time_slot_id", createAuthController(timeSlotUpdateControllerParams));
router.delete("/time_slots/:time_slot_id", createAuthController(timeSlotReleaseControllerParams));
router.get("/time_slots/:shop_id/available", createController(timeSlotAvailableControllerParams));

router.post("/slots", createAuthController(slotCreateControllerParams));
router.patch("/slots/:slot_id", createAuthController(slotUpdateControllerParams));
router.delete("/slots/:slot_id", createAuthController(slotDeleteControllerParams));

router.get("/slots/:shop_id/available", createController(slotAvailableControllerParams));
router.get("/slots/:shop_id/available/:slot_id", createController(slotAvailableControllerParams));
