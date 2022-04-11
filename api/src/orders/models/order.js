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
  };
}

module.exports = Order;