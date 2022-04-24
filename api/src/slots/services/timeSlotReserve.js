
const TimeSlot = require('../models/timeSlot');
const Slot = require('../models/slot');
const Customer = require('../../customers/models/customer');

const { BusinessError } = require('../../shared/errors');
const { snakeCaseKeys } = require('../../shared/transformKeys');

class TimeSlotReserve {
  static async process(customerId, slotId, data = {}) {
    const customer = await Customer.findByIdOrUid(customerId);
    if (!customer) {
      throw new BusinessError(`Customer ${customerId} does not exist!`);
    }

    const slot = await Slot.findByIdOrUid(slotId).modify('active').withGraphJoined('section.shop');
    if (!slot) {
      throw new BusinessError(`Slot ${slotId} does not exist!`);
    }

    const startedAt = data.startedAt && new Date(data.startedAt);
    const endedAt = data.endDate && new Date(data.endedAt);

    if (!slot.section.shop.isOpen(startedAt, endedAt)) {
      const errMsgEndedAt = endedAt ? endedAt.toISOString() : slot.section.shop.closingDate(startedAt).toISOString();
      throw new BusinessError(`Shop is not open between "${startedAt.toISOString()}" - "${errMsgEndedAt}"!`);
    }

    if (await this.hasIntersection(slot, data)) {
      const errMsgEndedAt = endedAt ? endedAt.toISOString() : slot.section.shop.closingDate(startedAt).toISOString();
      throw new BusinessError(`Time slot "${startedAt.toISOString()}" - "${errMsgEndedAt}" is not available!`);
    }

    return TimeSlot.query().modify('publicInsertColumns').insert({
      ...snakeCaseKeys(data),
      customer_id: customer.id,
      slot_id: slot.id
    });
  }

  // https://stackoverflow.com/questions/143552/comparing-date-ranges
  static async hasIntersection(slot, { startedAt, endedAt }) {
    const defaultEndedAt = slot.section.shop.closingDate(new Date(startedAt)).toISOString();

    const timeSlotsCount = await TimeSlot.query()
      .where({ slot_id: slot.id })
      .modify('reserved', startedAt, endedAt || defaultEndedAt)
      .resultSize();

    return timeSlotsCount > 0;
  }
}

module.exports = TimeSlotReserve;