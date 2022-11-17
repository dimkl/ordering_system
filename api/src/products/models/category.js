const BaseModel = require('../../shared/baseModel');

const schema = require('../schemas/category.json');

class Category extends BaseModel {
  static get tableName() {
    return 'categories';
  }

  static get jsonSchema() {
    return schema;
  }

  static get public_columns() {
    return Object.keys(schema.properties);
  }
}

module.exports = Category;