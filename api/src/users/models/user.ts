import { BaseModel } from "../../shared/baseModel";
import Password from "objection-password";
import schema from "../schemas/user.json";

const SENSITIVE_COLUMNS = ["password"];

export class User extends Password()(BaseModel) {
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
}

export interface User {
  id: number;
  created_at: Date;
  updated_at: Date;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  uuid: string;
  role: "guest" | "waiter" | "chef" | "other" | "admin";
}
