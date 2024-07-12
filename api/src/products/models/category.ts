import { BaseModel } from "../../shared/baseModel";
import schema from "../schemas/category.json";

export class Category extends BaseModel {
  static get tableName() {
    return "categories";
  }

  static get jsonSchema() {
    return schema;
  }

  static get public_columns() {
    return Object.keys(schema.properties);
  }
}

export interface Category {
  id: number;
  title: string;
  description: string;
  created_at: Date;
  updated_at: Date;
  uuid: string;
  uid: string;
}
