import { BaseModel } from "../../shared/baseModel";
import schema from "../schemas/productIngredient.json";

export class ProductIngredient extends BaseModel {
  id!: string;
  created_at!: Date;
  updated_at!: Date;
  ingredient_id!: string;
  product_id!: string;

  static get tableName() {
    return "product_ingredients";
  }

  static get jsonSchema() {
    return schema;
  }

  static get public_columns() {
    return Object.keys(schema.properties);
  }

  get idPrefix() {
    return "pri";
  }
}

export interface ProductIngredient {
  id: string;
  created_at: Date;
  updated_at: Date;
  ingredient_id: string;
  product_id: string;
  // Used to identify if the ingredient is allowed to be as extra / both extra & primary / primary
  selection_type: SelectionType;
}

type SelectionType = "primary" | "extra" | "primary_extra";
