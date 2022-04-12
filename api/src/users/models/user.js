const BaseModel = require('../../shared/baseModel');
const Password = require('objection-password')();
const schema = require('../schemas/user.json');

const SENSITIVE_COLUMNS = ['password'];
const PUBLIC_COLUMNS = Object.keys(schema.properties).filter(k => !SENSITIVE_COLUMNS.includes(k));

class User extends Password(BaseModel) {
  static get tableName() {
    return 'users';
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

module.exports = User;