import { BaseModel } from "../../shared/baseModel";
import Password from "objection-password";
import schema from "../schemas/user.json";

const SENSITIVE_COLUMNS = ["password"];

export class User extends Password()(BaseModel) {
  id!: string;

  static get tableName() {
    return "users";
  }

  static get jsonSchema() {
    return schema;
  }

  static get public_columns() {
    return Object.keys(schema.properties).filter((k) => !SENSITIVE_COLUMNS.includes(k));
  }

  get scopes() {
    return [];
  }

  get hasUidAsId() {
    return true;
  }
}

export interface User {
  id: string;
  created_at: Date;
  updated_at: Date;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: "guest" | "waiter" | "chef" | "other" | "admin";
}
