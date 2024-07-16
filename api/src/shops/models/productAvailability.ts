// https://schema.org/ItemAvailability
import { BaseModel } from "../../shared/baseModel";
import schema from "../schemas/productAvailability.json";

export class ProductAvailability extends BaseModel {
  id!: string;

  static get tableName() {
    return "product_availability";
  }

  static get jsonSchema() {
    return schema;
  }

  static get public_columns() {
    return Object.keys(schema.properties);
  }

  static get relationMappings() {
    return {
      shop: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: __dirname + "/shop.ts",
        join: {
          from: "product_availability.shop_id",
          to: "shops.id"
        }
      }
    };
  }

  get hasUidAsId() {
    return true;
  }
}

export interface ProductAvailability {
  id: string;
  created_at: Date;
  updated_at: Date;
  quantity: number;
  product_id: number;
  shop_id: string;
}
