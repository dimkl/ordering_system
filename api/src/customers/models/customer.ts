import { BaseModel } from "../../shared/baseModel";
import Password from "objection-password";
import schema from "../schemas/customer.json";

const SENSITIVE_COLUMNS = ["password"];

export class Customer extends Password()(BaseModel) {
  id!: number;
  first_name!: string;
  last_name!: string;
  email!: string;
  password!: string;
  created_at!: Date;
  updated_at!: Date;
  uuid!: string;

  static get tableName() {
    return "customers";
  }

  static get jsonSchema() {
    return schema;
  }

  static get public_columns() {
    return Object.keys(schema.properties).filter(
      (k) => !SENSITIVE_COLUMNS.includes(k)
    );
  }

  static get modifiers() {
    return {
      ...super.modifiers,
      tokenColumns(query) {
        query.select(
          "first_name",
          "last_name",
          "email",
          "created_at",
          "updated_at"
        );
      },
    };
  }

  get scopes() {
    return [];
  }
}

export interface Customer {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  created_at: Date;
  updated_at: Date;
  uuid: string;
}
