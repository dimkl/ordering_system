import { BaseModel } from "../../shared/baseModel";
import schema from "../schemas/category.json";

export class Category extends BaseModel {
  id!: string;

  static get tableName() {
    return "categories";
  }

  static get jsonSchema() {
    return schema;
  }

  static get public_columns() {
    return Object.keys(schema.properties);
  }

  get idPrefix() {
    return "cat";
  }
}

export interface Category {
  id: string;
  title: string;
  description: string;
  created_at: Date;
  updated_at: Date;
}
