import { Model, AjvValidator } from "objection";
import { DBErrors } from "objection-db-errors";
import addFormats from "ajv-formats";
import { ulid } from "ulid";

export class BaseModel extends DBErrors(Model) {
  static get modifiers() {
    return {
      publicColumns(query) {
        // @ts-expect-error this is missing definition for modelClass
        const cls = this.modelClass();
        query.select(cls.public_columns.map((c) => `${cls.tableName}.${c}`));
      },
      publicInsertColumns(query) {
        // @ts-expect-error this is missing definition for modelClass
        const cls = this.modelClass();
        query.returning(cls.public_columns.map((c) => `${cls.tableName}.${c}`));
      }
    };
  }

  static createValidator() {
    return new AjvValidator({
      onCreateAjv: (ajv) => {
        addFormats(ajv);
      },
      options: {
        allErrors: true,
        validateSchema: true,
        ownProperties: true
      }
    });
  }

  async $beforeInsert(queryContext) {
    await super.$beforeInsert(queryContext);

    this.generateUid();
  }

  async $beforeUpdate() {
    if ("updated_at" in this) {
      this.updated_at = new Date().toISOString();
    }
  }

  generateUid() {
    if ("id" in this) {
      this.id = ulid();
    }
  }
}
