import { v4 as uuidv4 } from "uuid";
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

    if (this.hasUuid) {
      this.generateUuid();
    }
  }

  async $beforeUpdate() {
    if ("updated_at" in this) {
      this.updated_at = new Date().toISOString();
    }
  }

  get hasUuid() {
    return true;
  }

  generateUuid() {
    if ("uuid" in this) {
      this.uuid = uuidv4();
    }
    if ("uid" in this) {
      this.uid = ulid();
    }
  }

  static findByIdOrUid(idOrUid: string | number) {
    return this.whereByIdOrUid(idOrUid).first().throwIfNotFound();
  }

  static whereByIdOrUid(idsOrUids: string[] | number[] | string | number) {
    const column = Number(idsOrUids) ? `${this.tableName}.id` : `${this.tableName}.uuid`;
    const idsOrUidsList = Array.isArray(idsOrUids) ? idsOrUids : [idsOrUids];

    return this.query().whereIn(column, idsOrUidsList);
  }

  static async getId(idOrUid: string | number) {
    if (!idOrUid) return idOrUid;
    if (Number(idOrUid)) return idOrUid;

    // @ts-expect-error there will always be an id in models
    const { id } = await this.findByIdOrUid(idOrUid).select("id");

    return id;
  }
}
