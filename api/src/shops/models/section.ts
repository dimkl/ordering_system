import { BaseModel } from "../../shared/baseModel";
import schema from "../schemas/section.json";
import type { User } from "../../users/models/user";
import type { Shop } from "./shop";

export class Section extends BaseModel {
  id!: string;

  static get tableName() {
    return "sections";
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
          from: "sections.shop_id",
          to: "shops.id"
        }
      }
    };
  }

  get hasUidAsId() {
    return true;
  }
}

export interface Section {
  id: string;
  created_at: Date;
  updated_at: Date;
  name: string;
  sku: string;
  shop_id: number;
  user_id: number;

  user: User;
  shop: Shop;
}
