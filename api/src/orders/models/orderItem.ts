import { BaseModel } from "../../shared/baseModel";
import schema from "../schemas/orderItem.json";

export class OrderItem extends BaseModel {
  static get tableName() {
    return "order_items";
  }

  static get jsonSchema() {
    return schema;
  }

  static get public_columns() {
    return Object.keys(schema.properties);
  }

  static get relationMappings() {
    return {
      product: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: __dirname + "/../../products/models/product.ts",
        join: {
          from: "order_items.product_id",
          to: "products.id",
        },
      },
      order: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: __dirname + "/order.ts",
        join: {
          from: "order_items.order_id",
          to: "orders.id",
        },
      },
    };
  }
}

export interface OrderItem {
  id: number;
  created_at: Date;
  updated_at: Date;
  order_id: number;
  quantity: number;
  product_id: number;
  uuid: string;
  state: "draft" | "placed" | "prepared" | "delivered" | "canceled";
}
