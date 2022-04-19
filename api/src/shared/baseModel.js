const uuid = require('uuid');
const { Model, AjvValidator } = require('objection')
const { DBErrors } = require('objection-db-errors');
const addFormats = require("ajv-formats");
const addKeywords = require('./addKeywords');

class BaseModel extends DBErrors(Model) {
  static createValidator() {
    return new AjvValidator({
      onCreateAjv: (ajv) => {
        addFormats(ajv);
        addKeywords(ajv);
      },
      options: {
        allErrors: true,
        validateSchema: true,
        ownProperties: true
      },
    });
  }

  async $beforeInsert(...args) {
    await super.$beforeInsert(...args)
    this.generateUuid();
  }

  async $beforeUpdate() {
    this.updated_at = new Date().toISOString();
  }

  generateUuid() {
    this.uuid = uuid.v4();
  }

  static findByIdOrUid(idOrUid) {
    let whereOptions = Number(idOrUid)
      ? { [`${this.tableName}.id`]: idOrUid }
      : { [`${this.tableName}.uuid`]: idOrUid };
    return this.query().where(whereOptions).first();
  }
}

module.exports = BaseModel;