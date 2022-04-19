const BaseModel = require('../../shared/baseModel');
const schema = require('../schemas/shop.json');

const PUBLIC_COLUMNS = Object.keys(schema.properties);

class Shop extends BaseModel {
  static get tableName() {
    return 'shops';
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

module.exports = Shop;