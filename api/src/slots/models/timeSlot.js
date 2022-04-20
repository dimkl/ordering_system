const BaseModel = require('../../shared/baseModel');
const schema = require('../schemas/timeSlot.json');

const PUBLIC_COLUMNS = Object.keys(schema.properties);

class TimeSlot extends BaseModel {
  static get tableName() {
    return 'time_slots';
  }

  static get jsonSchema() {
    return schema;
  }

  static get modifiers() {
    return {
      publicColumns(query) {
        query.select(PUBLIC_COLUMNS);
      }
    }
  }
}

module.exports = TimeSlot;