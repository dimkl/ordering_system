const BaseModel = require('../../shared/baseModel');

const schema = require('../schemas/orderItem.json');

class OrderItem extends BaseModel {
  static get tableName() {
    return 'order_items';
  }

  static get jsonSchema() {
    return schema;
  }

  static get public_columns() {
    return Object.keys(schema.properties);
  }

  static get relationMappings() {
    return {
      product: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: __dirname + '/../../products/models/product',
        join: {
          from: 'order_items.product_id',
          to: 'products.id'
        }
      },
      order: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: __dirname + '/order',
        join: {
          from: 'order_items.order_id',
          to: 'orders.id'
        }
      }
    }
  }
}

module.exports = OrderItem;