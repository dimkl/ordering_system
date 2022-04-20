const BaseModel = require('../../shared/baseModel');
const schema = require('../schemas/shop.json');

class Section extends BaseModel {
  static get tableName() {
    return 'sections';
  }

  static get jsonSchema() {
    return schema;
  }

  static get public_columns() {
    return Object.keys(schema.properties);
  }
}

module.exports = Section;