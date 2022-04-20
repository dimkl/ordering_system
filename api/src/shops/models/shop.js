const BaseModel = require('../../shared/baseModel');
const schema = require('../schemas/shop.json');

class Shop extends BaseModel {
  static get tableName() {
    return 'shops';
  }

  static get jsonSchema() {
    return schema;
  }

  static get public_columns() {
    return Object.keys(schema.properties);
  }
}

module.exports = Shop;