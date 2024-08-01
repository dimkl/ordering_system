import { BaseModel } from "../../shared/baseModel";
import schema from "../schemas/orderItem.json";

export class OrderItem extends BaseModel {
  id!: string;
  created_at!: Date;
  updated_at!: Date;
  order_id!: string;
  quantity!: number;
  product_id!: string;

  static get tableName() {
    return "order_items";
  }

  static get jsonSchema() {
    return schema;
  }

  static get jsonAttributes() {
    return ["product_snapshot"];
  }

  static get public_columns() {
    return Object.keys(schema.properties);
  }

  static get relationMappings() {
    return {
      product: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: __dirname + "/../../products/models/product",
        join: {
          from: "order_items.product_id",
          to: "products.id"
        }
      },
      order: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: __dirname + "/order",
        join: {
          from: "order_items.order_id",
          to: "orders.id"
        }
      }
    };
  }
  get idPrefix() {
    return "ort";
  }
}

export interface OrderItem {
  id: string;
  created_at: Date;
  updated_at: Date;
  order_id: string;
  quantity: number;
  product_id: string;
  state: "draft" | "placed" | "prepared" | "delivered" | "canceled";
  comments: string;
  product_snapshot:
    | {
        product: {
          id: string;
          title: string;
          description: string;
          qr: string;
        };
        ingredients: {
          id: string;
          title: string;
        }[];
      }
    | undefined;
}
