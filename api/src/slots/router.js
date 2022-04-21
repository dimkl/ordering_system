const Router = require('koa-router');

const setupDiscovery = require('../shared/setupDiscovery');

const loadTimeSlot = require('./helpers/loadTimeSlot');
const loadSlot = require('./helpers/loadSlot');

const TimeSlotListController = require('./controllers/time_slots/list');
const TimeSlotCreateController = require('./controllers/time_slots/create');
const TimeSlotUpdateController = require('./controllers/time_slots/update');
const TimeSlotDeleteController = require('./controllers/time_slots/delete');

const SlotListController = require('./controllers/slots/list');
const SlotCreateController = require('./controllers/slots/create');
const SlotUpdateController = require('./controllers/slots/update');
const SlotDeleteController = require('./controllers/slots/delete');

const router = new Router();

// setup params
router.param('time_slot_id', loadTimeSlot)
      .param('slot_id', loadSlot);

setupDiscovery(router, [
  TimeSlotListController.schema,
  TimeSlotCreateController.schema,
  TimeSlotUpdateController.schema,
  TimeSlotDeleteController.schema,
  SlotListController.schema,
  SlotCreateController.schema,
  SlotUpdateController.schema,
  SlotDeleteController.schema,
]);

router.get('/time_slots', TimeSlotListController.handler);
router.get('/time_slots/:time_slot_id', TimeSlotListController.handler);
router.post('/time_slots', TimeSlotCreateController.handler);
router.patch('/time_slots/:time_slot_id', TimeSlotUpdateController.handler);
router.delete('/time_slots/:time_slot_id', TimeSlotDeleteController.handler);

router.get('/slots', SlotListController.handler);
router.get('/slots/:slot_id', SlotListController.handler);
router.post('/slots', SlotCreateController.handler);
router.patch('/slots/:slot_id', SlotUpdateController.handler);
router.delete('/slots/:slot_id', SlotDeleteController.handler);

module.exports = router;