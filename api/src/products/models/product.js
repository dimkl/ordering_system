const BaseModel = require('../../shared/baseModel');

const schema = require('../schemas/product.json');

class Product extends BaseModel {
  static get tableName() {
    return 'products';
  }

  static get jsonSchema() {
    return schema;
  }

  static get public_columns() {
    return Object.keys(schema.properties);
  }
}

module.exports = Product;