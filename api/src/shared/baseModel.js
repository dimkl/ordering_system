const uuid = require('uuid');
const { Model, AjvValidator } = require('objection')
const { DBErrors } = require('objection-db-errors');
const addFormats = require("ajv-formats");
const addKeywords = require('./addKeywords');

class BaseModel extends DBErrors(Model) {
  static get modifiers() {
    return {
      publicColumns(query) {
        const cls = this.modelClass();
        query.select(cls.public_columns.map(c => `${cls.tableName}.${c}`));
      },
      publicInsertColumns(query) {
        const cls = this.modelClass();
        query.returning(cls.public_columns.map(c => `${cls.tableName}.${c}`));
      }
    }
  }

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

  async $beforeInsert(queryContext) {
    await super.$beforeInsert(queryContext)

    if (this.hasUuid) {
      this.generateUuid();
    }
  }

  async $beforeUpdate() {
    this.updated_at = new Date().toISOString();
  }

  get hasUuid() {
    return true;
  }

  generateUuid() {
    this.uuid = uuid.v4();
  }

  static findByIdOrUid(idsOrUids) {
    return this.whereByIdOrUid(idsOrUids).first().throwIfNotFound();
  }

  static whereByIdOrUid(idsOrUids) {
    const column = Number(idsOrUids) ? `${this.tableName}.id` : `${this.tableName}.uuid`
    idsOrUids = Array.isArray(idsOrUids) ? idsOrUids : [idsOrUids];

    return this.query().whereIn(column, idsOrUids);
  }

  static async getId(idOrUid) {
    if (!idOrUid) return idOrUid;
    if (Number(idOrUid)) return idOrUid;

    const { id } = await this.findByIdOrUid(idOrUid).select('id');

    return id;
  }
}

module.exports = BaseModel;