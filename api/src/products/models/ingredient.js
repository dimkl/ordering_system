const BaseModel = require('../../shared/baseModel');

const schema = require('../schemas/ingredient.json');

class Ingredient extends BaseModel {
  static get tableName() {
    return 'ingredients';
  }

  static get jsonSchema() {
    return schema;
  }

  static get public_columns() {
    return Object.keys(schema.properties);
  }
}

module.exports = Ingredient;