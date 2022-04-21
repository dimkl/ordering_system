const BaseModel = require('../../shared/baseModel');
const schema = require('../schemas/timeSlot.json');
class TimeSlot extends BaseModel {
  static get tableName() {
    return 'time_slots';
  }

  static get public_columns() {
    return Object.keys(schema.properties);
  }

  static get jsonSchema() {
    return schema;
  }

  static get modifiers() {
    return {
      ...super.modifiers,
      publicColumns(query) {
        query
          .select('time_slots.*')
          .joinRelated('customer')
          .select('customer.uuid as customer_id')
          .joinRelated('slot')
          .select('slot.uuid as slot_id');
      }
    }
  }

  static get relationMappings() {
    return {
      customer: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: __dirname + '/../../customers/models/customer',
        join: {
          from: 'time_slots.customer_id',
          to: 'customers.id'
        }
      },
      slot: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: __dirname + '/slot',
        join: {
          from: 'time_slots.slot_id',
          to: 'slots.id'
        }
      }
    }
  }
}

module.exports = TimeSlot;