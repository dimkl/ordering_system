import { BaseModel } from "../../shared/baseModel";
import schema from "../schemas/holiday.json";

export class Holiday extends BaseModel {
  uid!: string;
  static get tableName() {
    return "holidays";
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
        modelClass: __dirname + "/../../shops/models/shop.ts",
        join: {
          from: "holidays.shop_id",
          to: "shops.id"
        }
      }
    };
  }
}

export interface Holiday {
  id: number;
  uid: string;
  created_at: Date;
  updated_at: Date;
  name: string;
  date: Date;
  shop_id: number;
}
