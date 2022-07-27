const Router = require('koa-router');

const verifyToken = require('../shared/middlewares/verifyToken');
const authorize = require('../shared/middlewares/authorize');

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
router.use(verifyToken());

router.get('/time_slots', authorize(['urn:time_slots:r']), TimeSlotListController);
router.get('/time_slots/:time_slot_id', authorize(['urn:time_slots:r']), TimeSlotListController);
router.post('/time_slots/reserve', authorize(['urn:time_slots:c']), TimeSloReserveController);
router.patch('/time_slots/:time_slot_id', authorize(['urn:time_slots:u']), TimeSlotUpdateController);
router.delete('/time_slots/release/:time_slot_id', authorize(['urn:time_slots:d']), TimeSlotReleaseController);

router.post('/slots', authorize(['urn:slots:c']), SlotCreateController);
router.patch('/slots/:slot_id', authorize(['urn:slots:u']), SlotUpdateController);
router.delete('/slots/:slot_id', authorize(['urn:slots:d']), SlotDeleteController);

router.get('/slots/:shop_id/available', authorize(['urn:slots:a']), SlotAvailableController);
router.get('/slots/:shop_id/available/:slot_id', authorize(['urn:slots:a']), SlotAvailableController);

module.exports = router;
