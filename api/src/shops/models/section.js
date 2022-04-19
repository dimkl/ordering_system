const BaseModel = require('../../shared/baseModel');
const schema = require('../schemas/shop.json');

const PUBLIC_COLUMNS = Object.keys(schema.properties);

class Section extends BaseModel {
  static get tableName() {
    return 'sections';
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

module.exports = Section;