const BaseModel = require('../../shared/baseModel');
const schema = require('../schemas/slot.json');

class Slot extends BaseModel {
  static get tableName() {
    return 'slots';
  }

  static get jsonSchema() {
    return schema;
  }

  static get public_columns() {
    return Object.keys(schema.properties);
  }
}

module.exports = Slot;