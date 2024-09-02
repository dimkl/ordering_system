import { BaseModel } from "../../shared/baseModel";
import schema from "../schemas/product.json";

export class Product extends BaseModel {
  id!: string;

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
        modelClass: __dirname + "/ingredient",
        join: {
          from: "products.id",
          to: "ingredients.id",
          through: {
            from: "product_ingredients.product_id",
            to: "product_ingredients.ingredient_id",
            extra: ["selection_type"]
          }
        }
      },
      variations: {
        relation: BaseModel.HasManyRelation,
        modelClass: __dirname + "/product",
        join: {
          from: "products.id",
          to: "products.variant_id"
        }
      },
      category: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: __dirname + "/category",
        join: {
          from: "products.category_id",
          to: "categories.id"
        }
      }
    };
  }

  get idPrefix() {
    return "prd";
  }

  static get modifiers() {
    return {
      ...super.modifiers,
      ingredients(query) {
        query.withGraphJoined("ingredients(publicColumns)");
      },
      variations(query) {
        query
          .withGraphJoined("variations")
          .where("products.variant_id", "is", null)
          .orderBy("products.id");
      },
      excludeExtraIngredients(query) {
        query
          .withGraphJoined("ingredients(publicColumns)")
          .whereIn("selection_type", ["primary", "primary_extra"]);
      }
    };
  }

  static findWithIngredients(productId) {
    return this.query().modify("ingredients").findById(productId);
  }

  static findVariationsWithIngredients(productId) {
    return this.query()
      .modify(["publicColumns", "variations"])
      .withGraphFetched("[ingredients(publicColumns), variations.ingredients(publicColumns)]")
      .findById(productId);
  }

  toSnapshot() {
    return {
      id: this.id,
      title: this.title,
      description: this.description
    };
  }
}

export interface Product {
  id: string;
  title: string;
  description: string;
  // Tracks the price, product details, manufacturer, and point-of-sale.
  // Used in generated barcodes.
  sku: string;
  created_at: Date;
  updated_at: Date;
  // Original product ID that product variations depend
  variant_id: string;
  category_id: string;

  // Used for stock functionality and menu
  shop_id: string;
  quantity: number;
}
