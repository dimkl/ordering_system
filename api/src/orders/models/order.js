const BaseModel = require('../../shared/baseModel');

const schema = require('../schemas/order.json');

const PUBLIC_COLUMNS = Object.keys(schema.properties);

class Order extends BaseModel {
  static get tableName() {
    return 'orders';
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
      order_items: {
        relation: BaseModel.HasManyRelation,
        modelClass: __dirname + '/orderItem',
        join: {
          from: 'orders.id',
          to: 'order_items.order_id'
        }
      },
      customer: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: __dirname + '/../../customers/models/customer',
        join: {
          from: 'orders.customer_id',
          to: 'customers.id'
        }
      }
    }
  }

  static findWithOrderItemsAndProducts(orderId) {
    return this.query()
      .modify('publicColumns')
      .withGraphFetched(
        'order_items(selectOrderItem).product(selectProduct)'
      )
      .modifiers({
        selectOrderItem(builder) {
          builder.select('id', 'state', 'quantity', 'created_at', 'updated_at');
        },
        selectProduct(builder) {
          builder.select('title', 'description', 'qr', 'sku');
        },
      })
      .findById(orderId)
  }
}

module.exports = Order;