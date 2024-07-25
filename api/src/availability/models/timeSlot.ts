import type { Customer } from "../../customers/models/customer";
import type { Slot } from "./slot";

import { BaseModel } from "../../shared/baseModel";
import schema from "../schemas/timeSlot.json";
export class TimeSlot extends BaseModel {
  created_at!: Date;
  updated_at!: Date;
  slot_id!: string;
  customer_id!: string;
  id!: string;

  static get tableName() {
    return "time_slots";
  }

  static get public_columns() {
    return Object.keys(schema.properties);
  }

  static get jsonSchema() {
    return schema;
  }

  static get modifiers() {
    return {
      ...super.modifiers,
      publicColumns(query) {
        query.select("time_slots.*").joinRelated("customer");
      },
      reservedSlot(query, shopId, startedAt, endedAt, slotId) {
        query
          .modify("inShop", shopId)
          .whereBetween("started_at", [startedAt, endedAt])
          .where("slot_id", slotId)
          .orderBy("started_at");
      },
      reserved(query, shopId, startedAt, endedAt) {
        query
          .modify("inShop", shopId)
          .whereBetween("started_at", [startedAt, endedAt])
          .orderBy("started_at");
      },
      inShop(query, shopId: string) {
        query
          .innerJoin("slots", "time_slots.slot_id", "slots.id")
          .innerJoin("sections", "sections.id", "slots.section_id")
          .where("sections.shop_id", shopId)
          .where("slots.active", true);
      }
    };
  }

  static get relationMappings() {
    return {
      customer: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: __dirname + "/../../customers/models/customer",
        join: {
          from: "time_slots.customer_id",
          to: "customers.id"
        }
      },
      slot: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: __dirname + "/slot",
        join: {
          from: "time_slots.slot_id",
          to: "slots.id"
        }
      }
    };
  }

  get idPrefix() {
    return "tms";
  }
}

export interface TimeSlot {
  id: string;
  created_at: Date;
  updated_at: Date;
  started_at: number;
  ended_at: number;
  slot_id: string;
  customer_id: string;
  slot?: Slot;
  customer?: Customer;
}
