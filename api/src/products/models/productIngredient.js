const BaseModel = require('../../shared/baseModel');

const schema = require('../schemas/productIngredient.json');

class ProductIngredient extends BaseModel {
  static get tableName() {
    return 'product_ingredients';
  }

  static get jsonSchema() {
    return schema;
  }

  static get public_columns() {
    return Object.keys(schema.properties);
  }

  get hasUuid() {
    return false;
  }
}

module.exports = ProductIngredient;