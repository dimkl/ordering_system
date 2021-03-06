const BaseModel = require('../../shared/baseModel');

const schema = require('../schemas/order.json');

class Order extends BaseModel {
  static get tableName() {
    return 'orders';
  }

  static get jsonSchema() {
    return schema;
  }

  static get public_columns() {
    return Object.keys(schema.properties);
  }

  static get modifiers() {
    return {
      ...super.modifiers,
      publicColumns(query) {
        query
          .select('orders.*')
          .joinRelated('customer')
          .select('customer.uuid as customer_id')
          .joinRelated('timeSlot')
          .select('timeSlot.uuid as time_slot_id');
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
      },
      timeSlot: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: __dirname + '/../../slots/models/timeSlot',
        join: {
          from: 'orders.time_slot_id',
          to: 'time_slots.id'
        }
      },
      slot: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: __dirname + '/../../slots/models/slot',
        join: {
          from: 'orders.time_slot_id',
          to: 'slots.id',
          through: {
            from: 'time_slots.id',
            to: 'time_slots.slot_id'
          }
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
          builder.select('id', 'uuid', 'state', 'quantity', 'created_at', 'updated_at').orderBy('id', 'asc');
        },
        selectProduct(builder) {
          builder.select('title', 'description', 'qr', 'uuid').orderBy('id', 'asc');
        },
      })
      .findById(orderId)
  }
}

module.exports = Order;