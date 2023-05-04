import { BaseModel } from "../../shared/baseModel";
import schema from "../schemas/product.json";

export class Product extends BaseModel {
  static get tableName() {
    return "products";
  }

  static get jsonSchema() {
    return schema;
  }

  static get public_columns() {
    return Object.keys(schema.properties);
  }

  static get relationMappings() {
    return {
      ingredients: {
        relation: BaseModel.ManyToManyRelation,
        modelClass: __dirname + "/ingredient.ts",
        join: {
          from: "products.id",
          to: "ingredients.id",
          through: {
            from: "product_ingredients.product_id",
            to: "product_ingredients.ingredient_id",
          },
        },
      },
      variations: {
        relation: BaseModel.HasManyRelation,
        modelClass: __dirname + "/product.ts",
        join: {
          from: "products.id",
          to: "products.variant_id",
        },
      },
      category: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: __dirname + "/category.ts",
        join: {
          from: "products.category_id",
          to: "categories.id",
        },
      },
    };
  }

  static get modifiers() {
    return {
      ...super.modifiers,
      joinVariations(query) {
        query
          .withGraphJoined("variations")
          .where("products.variant_id", "is", null);
      },
    };
  }

  static findWithIngredients(productId) {
    return this.query()
      .modify("publicColumns")
      .withGraphFetched("ingredients(publicColumns)")
      .findById(productId);
  }

  static findVariationsWithIngredients(productId) {
    return this.query()
      .modify(["publicColumns", "joinVariations"])
      .withGraphFetched(
        "[ingredients(publicColumns), variations.ingredients(publicColumns)]"
      )
      .findById(productId);
  }
}

export interface Product {
  id: number;
  title: string;
  description: string;
  qr: string;
  sku: string;
  created_at: Date;
  updated_at: Date;
  uuid: string;
  variant_id: number;
  category_id: number;
}
