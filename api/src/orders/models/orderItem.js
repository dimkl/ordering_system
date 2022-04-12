const BaseModel = require('../../shared/baseModel');

const schema = require('../schemas/orderItem.json');

const PUBLIC_COLUMNS = Object.keys(schema.properties);

class OrderItem extends BaseModel {
  static get tableName() {
    return 'order_items';
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
      }
    }
  }
}

module.exports = OrderItem;