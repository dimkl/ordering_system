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

  static get relationMappings() {
    return {
      ingredients: {
        relation: BaseModel.ManyToManyRelation,
        modelClass: __dirname + '/ingredient',
        join: {
          from: 'products.id',
          to: 'ingredients.id',
          through: {
            from: 'product_ingredients.product_id',
            to: 'product_ingredients.ingredient_id'
          }
        }
      }
    }
  }

  static findWithIngredients(productId) {
    return this.query()
      .modify('publicColumns')
      .withGraphFetched('ingredients(publicColumns)')
      .findById(productId)
  }
}

module.exports = Product;