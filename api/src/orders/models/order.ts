import type { OrderItem } from "./orderItem";
import { TimeSlot } from "../../availability/models";
import { Customer } from "../../customers/models/customer";

import { BaseModel } from "../../shared/baseModel";
import schema from "../schemas/order.json";

export class Order extends BaseModel {
  id!: string;

  created_at!: Date;
  updated_at!: Date;
  customer_id!: string;
  time_slot_id!: number;

  static get tableName() {
    return "orders";
  }

  static get jsonSchema() {
    return schema;
  }

  static get public_columns() {
    return Object.keys(schema.properties);
  }

  static get modifiers() {
    return {
      ...super.modifiers,
      publicColumns(query) {
        query
          .select("orders.*")
          .joinRelated("customer")
          .joinRelated("timeSlot")
          .select("timeSlot.uuid as time_slot_id");
      }
    };
  }

  static get relationMappings() {
    return {
      order_items: {
        relation: BaseModel.HasManyRelation,
        modelClass: __dirname + "/orderItem.ts",
        join: {
          from: "orders.id",
          to: "order_items.order_id"
        }
      },
      customer: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: __dirname + "/../../customers/models/customer.ts",
        join: {
          from: "orders.customer_id",
          to: "customers.id"
        }
      },
      timeSlot: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: __dirname + "/../../availability/models/timeSlot.ts",
        join: {
          from: "orders.time_slot_id",
          to: "time_slots.id"
        }
      },
      slot: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: __dirname + "/../../availability/models/slot.ts",
        join: {
          from: "orders.time_slot_id",
          to: "slots.id",
          through: {
            from: "time_slots.id",
            to: "time_slots.slot_id"
          }
        }
      }
    };
  }

  static findWithOrderItemsAndProducts(orderId) {
    return this.query()
      .modify("publicColumns")
      .withGraphFetched("order_items(selectOrderItem).product(selectProduct)")
      .modifiers({
        selectOrderItem(builder) {
          builder
            .select("id", "state", "quantity", "created_at", "updated_at")
            .orderBy("id", "asc");
        },
        selectProduct(builder) {
          builder.select("title", "description", "qr", "uid", "uuid").orderBy("id", "asc");
        }
      })
      .findById(orderId);
  }

  get hasUidAsId() {
    return true;
  }
}
export interface Order {
  id: string;
  created_at: Date;
  updated_at: Date;
  customer_id: string;
  time_slot_id: number;
  state:
    | "draft"
    | "placed"
    | "processing"
    | "delivered"
    | "payment_requested"
    | "invoiced"
    | "paid"
    | "canceled";
  order_items: OrderItem[];
  customer: Customer;
  timeSlot: TimeSlot;
}
