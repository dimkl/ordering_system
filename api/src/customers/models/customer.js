const BaseModel = require('../../shared/baseModel');
const Password = require('objection-password')();
const schema = require('../schemas/customer.json');

const SENSITIVE_COLUMNS = ['password'];
const PUBLIC_COLUMNS = Object.keys(schema.properties).filter(k => !SENSITIVE_COLUMNS.includes(k));

class Customer extends Password(BaseModel) {
  static get tableName() {
    return 'customers';
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
}

module.exports = Customer;