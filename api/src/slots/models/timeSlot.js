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

  
}

module.exports = TimeSlot;