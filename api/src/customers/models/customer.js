const { Model } = require('objection')

const schema = require('../schemas/customer.json');

class Customer extends Model {
  // Table name is the only required property.
  static get tableName() {
    return 'customers';
  }

  static get jsonSchema() {
    return schema;
  }
}

module.exports = Customer;