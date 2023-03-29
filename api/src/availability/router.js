const Router = require("koa-router");

const ControllerFactory = require("../shared/controllerFactory");

const loadTimeSlot = require("./helpers/loadTimeSlot");
const loadSlot = require("./helpers/loadSlot");
const loadShop = require("./helpers/loadShop");

const timeSlotListController = require("./controllers/time_slots/list");
const timeSloReserveController = require("./controllers/time_slots/reserve");
const timeSlotUpdateController = require("./controllers/time_slots/update");
const timeSlotReleaseController = require("./controllers/time_slots/release");

const slotAvailableController = require("./controllers/slots/available");
const slotCreateController = require("./controllers/slots/create");
const slotUpdateController = require("./controllers/slots/update");
const slotDeleteController = require("./controllers/slots/delete");

const router = new Router();

// setup params
router
  .param("time_slot_id", loadTimeSlot)
  .param("slot_id", loadSlot)
  .param("shop_id", loadShop);

router.get(
  "/time_slots",
  ControllerFactory.create({
    ...timeSlotListController,
    scopes: ["urn:time_slots:r"],
  })
);
router.get(
  "/time_slots/:time_slot_id",
  ControllerFactory.create({
    ...timeSlotListController,
    scopes: ["urn:time_slots:r"],
  })
);
router.post(
  "/time_slots/reserve",
  ControllerFactory.create({
    ...timeSloReserveController,
    scopes: ["urn:time_slots:c"],
  })
);
router.patch(
  "/time_slots/:time_slot_id",
  ControllerFactory.create({
    ...timeSlotUpdateController,
    scopes: ["urn:time_slots:u"],
  })
);
router.delete(
  "/time_slots/release/:time_slot_id",
  ControllerFactory.create({
    ...timeSlotReleaseController,
    scopes: ["urn:time_slots:d"],
  })
);

router.post(
  "/slots",
  ControllerFactory.create({
    ...slotCreateController,
    scopes: ["urn:slots:c"],
  })
);
router.patch(
  "/slots/:slot_id",
  ControllerFactory.create({
    ...slotUpdateController,
    scopes: ["urn:slots:u"],
  })
);
router.delete(
  "/slots/:slot_id",
  ControllerFactory.create({
    ...slotDeleteController,
    scopes: ["urn:slots:d"],
  })
);

router.get(
  "/slots/:shop_id/available",
  ControllerFactory.create({
    ...slotAvailableController,
    scopes: ["urn:slots:r"],
  })
);
router.get(
  "/slots/:shop_id/available/:slot_id",
  ControllerFactory.create({
    ...slotAvailableController,
    scopes: ["urn:slots:r"],
  })
);

module.exports = router;
