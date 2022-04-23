// https://schema.org/ItemAvailability
const BaseModel = require('../../shared/baseModel');
const schema = require('../schemas/productAvailability.json');

class ProductAvailability extends BaseModel {
  static get tableName() {
    return 'product_availability';
  }

  static get jsonSchema() {
    return schema;
  }

  static get public_columns() {
    return Object.keys(schema.properties);
  }

  static get relationMappings() {
    return {
      shop: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: __dirname + '/../../shops/models/shop',
        join: {
          from: 'product_availability.shop_id',
          to: 'shops.id'
        }
      }
    }
  }
}

module.exports = ProductAvailability;