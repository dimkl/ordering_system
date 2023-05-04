import { BaseModel } from "../../shared/baseModel";
import schema from "../schemas/productIngredient.json";

export class ProductIngredient extends BaseModel {
  id!: number;
  created_at!: Date;
  updated_at!: Date;
  ingredient_id!: number;
  product_id!: number;

  static get tableName() {
    return "product_ingredients";
  }

  static get jsonSchema() {
    return schema;
  }

  static get public_columns() {
    return Object.keys(schema.properties);
  }

  get hasUuid() {
    return false;
  }
}

export interface ProductIngredient {
  id: number;
  created_at: Date;
  updated_at: Date;
  ingredient_id: number;
  product_id: number;
}
