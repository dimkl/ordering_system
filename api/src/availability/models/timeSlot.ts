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
      reserved(query, startedAt, endedAt) {
        query.where("started_at", "<=", endedAt).where(function () {
          // @ts-expect-error this is the same type as query
          this.where("ended_at", ">=", startedAt).orWhere("ended_at", "is", null);
        });
      }
    };
  }

  static get relationMappings() {
    return {
      customer: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: __dirname + "/../../customers/models/customer.ts",
        join: {
          from: "time_slots.customer_id",
          to: "customers.id"
        }
      },
      slot: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: __dirname + "/slot.ts",
        join: {
          from: "time_slots.slot_id",
          to: "slots.id"
        }
      }
    };
  }

  get hasUidAsId() {
    return true;
  }
}

export interface TimeSlot {
  id: string;
  created_at: Date;
  updated_at: Date;
  started_at: Date;
  ended_at: Date;
  slot_id: string;
  customer_id: string;
  slot?: Slot;
  customer?: Customer;
}
