import { BaseModel } from "../../shared/baseModel";
import schema from "../schemas/ingredient.json";

export class Ingredient extends BaseModel {
  id!: string;

  static get tableName() {
    return "ingredients";
  }

  static get jsonSchema() {
    return schema;
  }

  static get public_columns() {
    return Object.keys(schema.properties);
  }

  get idPrefix() {
    return "ing";
  }

  toSnapshot() {
    return {
      id: this.id,
      title: this.title
    };
  }
}

type SuitableForDiet =
  | "all"
  | "diabetic"
  | "gluten_free"
  | "halal"
  | "hindu"
  | "kosher"
  | "low_calorie"
  | "low_fat"
  | "low_lactose"
  | "low_salt"
  | "vegan"
  | "vegetarian";

export interface Ingredient {
  id: string;
  title: string;
  description: string;
  sku: string;
  created_at: Date;
  updated_at: Date;
  allergen: boolean;
  suitable_for_diet: SuitableForDiet;
  shop_id: string;
}
