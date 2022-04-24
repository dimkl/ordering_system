const Router = require('koa-router');

const loadTimeSlot = require('./helpers/loadTimeSlot');
const loadSlot = require('./helpers/loadSlot');
const loadShop = require('./helpers/loadShop');

const TimeSlotListController = require('./controllers/time_slots/list');
const TimeSloReserveController = require('./controllers/time_slots/reserve');
const TimeSlotUpdateController = require('./controllers/time_slots/update');
const TimeSlotReleaseController = require('./controllers/time_slots/release');

const SlotAvailableController = require('./controllers/slots/available');
const SlotCreateController = require('./controllers/slots/create');
const SlotUpdateController = require('./controllers/slots/update');
const SlotDeleteController = require('./controllers/slots/delete');

const router = new Router();

// setup params
router.param('time_slot_id', loadTimeSlot)
      .param('slot_id', loadSlot)
      .param('shop_id', loadShop);

router.get('/time_slots', TimeSlotListController);
router.get('/time_slots/:time_slot_id', TimeSlotListController);
router.post('/time_slots/reserve', TimeSloReserveController);
router.patch('/time_slots/:time_slot_id', TimeSlotUpdateController);
router.delete('/time_slots/release/:time_slot_id', TimeSlotReleaseController);

router.post('/slots', SlotCreateController);
router.patch('/slots/:slot_id', SlotUpdateController);
router.delete('/slots/:slot_id', SlotDeleteController);

router.get('/slots/:shop_id/available', SlotAvailableController);
router.get('/slots/:shop_id/available/:slot_id', SlotAvailableController);

module.exports = router;
