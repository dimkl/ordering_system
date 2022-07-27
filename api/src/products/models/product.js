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
      },
      variations: {
        relation: BaseModel.HasManyRelation,
        modelClass: __dirname + '/product',
        join: {
          from: 'products.id',
          to: 'products.variant_id',
        }
      }
    }
  }

  static get modifiers() {
    return {
      ...super.modifiers,
      joinVariations(query) {
        query
          .withGraphJoined('variations')
          .where('products.variant_id', 'is', null);
      }
    }
  }

  static findWithIngredients(productId) {
    return this.query()
      .modify('publicColumns')
      .withGraphFetched('ingredients(publicColumns)')
      .findById(productId);
  }

  static findVariationsWithIngredients(productId) {
    return this.query()
      .modify(['publicColumns', 'joinVariations'])
      .withGraphFetched('[ingredients(publicColumns), variations.ingredients(publicColumns)]')
      .findById(productId);
  }
}

module.exports = Product;