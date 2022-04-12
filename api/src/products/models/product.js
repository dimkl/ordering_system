const BaseModel = require('../../shared/baseModel');

const schema = require('../schemas/product.json');

const PUBLIC_COLUMNS = Object.keys(schema.properties);

class Product extends BaseModel {
  static get tableName() {
    return 'products';
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
  };
}

module.exports = Product;