import Router from "koa-router";

import { createController } from "../shared/controller";

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

router.get(
  "/time_slots",
  createController({
    ...timeSlotListControllerParams,
    scopes: ["urn:time_slots:r"]
  })
);
router.post(
  "/time_slots",
  createController({
    ...timeSloCreateControllerParams,
    scopes: ["urn:time_slots:c"]
  })
);
router.get(
  "/time_slots/:time_slot_id",
  createController({
    ...timeSlotListControllerParams,
    scopes: ["urn:time_slots:r"]
  })
);
router.patch(
  "/time_slots/:time_slot_id",
  createController({
    ...timeSlotUpdateControllerParams,
    scopes: ["urn:time_slots:u"]
  })
);
router.delete(
  "/time_slots/:time_slot_id",
  createController({
    ...timeSlotReleaseControllerParams,
    scopes: ["urn:time_slots:d"]
  })
);
router.get(
  "/time_slots/:shop_id/available",
  createController({
    ...timeSlotAvailableControllerParams,
    scopes: ["urn:time_slots:r"]
  })
);

router.post(
  "/slots",
  createController({
    ...slotCreateControllerParams,
    scopes: ["urn:slots:c"]
  })
);
router.patch(
  "/slots/:slot_id",
  createController({
    ...slotUpdateControllerParams,
    scopes: ["urn:slots:u"]
  })
);
router.delete(
  "/slots/:slot_id",
  createController({
    ...slotDeleteControllerParams,
    scopes: ["urn:slots:d"]
  })
);

router.get(
  "/slots/:shop_id/available",
  createController({
    ...slotAvailableControllerParams,
    scopes: ["urn:slots:r"]
  })
);
router.get(
  "/slots/:shop_id/available/:slot_id",
  createController({
    ...slotAvailableControllerParams,
    scopes: ["urn:slots:r"]
  })
);
