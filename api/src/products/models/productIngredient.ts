import { BaseModel } from "../../shared/baseModel";
import schema from "../schemas/productIngredient.json";

export class ProductIngredient extends BaseModel {
  id!: string;
  created_at!: Date;
  updated_at!: Date;
  ingredient_id!: string;
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

  get hasUidAsId() {
    return true;
  }
}

export interface ProductIngredient {
  id: string;
  created_at: Date;
  updated_at: Date;
  ingredient_id: string;
  product_id: number;
}
