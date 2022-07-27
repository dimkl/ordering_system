const BaseModel = require('../../shared/baseModel');
const Password = require('objection-password')();
const schema = require('../schemas/user.json');

const SENSITIVE_COLUMNS = ['password'];

class User extends Password(BaseModel) {
  static get tableName() {
    return 'users';
  }

  static get jsonSchema() {
    return schema;
  }

  static get public_columns() {
    return Object.keys(schema.properties).filter(k => !SENSITIVE_COLUMNS.includes(k));;
  }

  get scopes() {
    return [];
  }
}

module.exports = User;