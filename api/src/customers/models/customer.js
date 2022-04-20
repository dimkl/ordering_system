const BaseModel = require('../../shared/baseModel');
const Password = require('objection-password')();
const schema = require('../schemas/customer.json');

const SENSITIVE_COLUMNS = ['password'];

class Customer extends Password(BaseModel) {
  static get tableName() {
    return 'customers';
  }

  static get jsonSchema() {
    return schema;
  }

  static get public_columns() {
    return Object.keys(schema.properties).filter(k => !SENSITIVE_COLUMNS.includes(k));
  }
}

module.exports = Customer;