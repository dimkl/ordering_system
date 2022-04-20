const BaseModel = require('../../shared/baseModel');
const schema = require('../schemas/slot.json');

const PUBLIC_COLUMNS = Object.keys(schema.properties);

class Slot extends BaseModel {
  static get tableName() {
    return 'slots';
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

module.exports = Slot;