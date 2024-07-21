import Router from "koa-router";

import { ControllerFactory } from "../shared/controllerFactory";

import { loadTimeSlot } from "./helpers/loadTimeSlot";
import { loadSlot } from "./helpers/loadSlot";
import { loadShop } from "./helpers/loadShop";

import * as timeSlotListController from "./controllers/time_slots/list";
import * as timeSloReserveController from "./controllers/time_slots/reserve";
import * as timeSlotUpdateController from "./controllers/time_slots/update";
import * as timeSlotReleaseController from "./controllers/time_slots/release";
import * as timeSlotAvailableController from "./controllers/time_slots/available";

import * as slotAvailableController from "./controllers/slots/available";
import * as slotCreateController from "./controllers/slots/create";
import * as slotUpdateController from "./controllers/slots/update";
import * as slotDeleteController from "./controllers/slots/delete";

export const router = new Router();

// setup params
router.param("time_slot_id", loadTimeSlot).param("slot_id", loadSlot).param("shop_id", loadShop);

router.get(
  "/time_slots",
  ControllerFactory.create({
    ...timeSlotListController,
    scopes: ["urn:time_slots:r"]
  })
);
router.get(
  "/time_slots/:time_slot_id",
  ControllerFactory.create({
    ...timeSlotListController,
    scopes: ["urn:time_slots:r"]
  })
);
router.post(
  "/time_slots/reserve",
  ControllerFactory.create({
    ...timeSloReserveController,
    scopes: ["urn:time_slots:c"]
  })
);
router.patch(
  "/time_slots/:time_slot_id",
  ControllerFactory.create({
    ...timeSlotUpdateController,
    scopes: ["urn:time_slots:u"]
  })
);
router.delete(
  "/time_slots/release/:time_slot_id",
  ControllerFactory.create({
    ...timeSlotReleaseController,
    scopes: ["urn:time_slots:d"]
  })
);
router.get(
  "/time_slots/:shop_id/available",
  ControllerFactory.create({
    ...timeSlotAvailableController,
    scopes: ["urn:time_slots:r"]
  })
);

router.post(
  "/slots",
  ControllerFactory.create({
    ...slotCreateController,
    scopes: ["urn:slots:c"]
  })
);
router.patch(
  "/slots/:slot_id",
  ControllerFactory.create({
    ...slotUpdateController,
    scopes: ["urn:slots:u"]
  })
);
router.delete(
  "/slots/:slot_id",
  ControllerFactory.create({
    ...slotDeleteController,
    scopes: ["urn:slots:d"]
  })
);

router.get(
  "/slots/:shop_id/available",
  ControllerFactory.create({
    ...slotAvailableController,
    scopes: ["urn:slots:r"]
  })
);
router.get(
  "/slots/:shop_id/available/:slot_id",
  ControllerFactory.create({
    ...slotAvailableController,
    scopes: ["urn:slots:r"]
  })
);
