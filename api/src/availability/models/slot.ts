import type { User } from "../../users/models/user";
import type { Section } from "../../shops/models";

import { BaseModel } from "../../shared/baseModel";
import schema from "../schemas/slot.json";

export class Slot extends BaseModel {
  static get tableName() {
    return "slots";
  }

  static get jsonSchema() {
    return schema;
  }

  static get modifiers() {
    return {
      ...super.modifiers,
      publicColumns(query) {
        query
          .select("slots.*")
          .joinRelated("user")
          .select("user.uuid as user_id")
          .joinRelated("section")
          .select("section.uuid as section_id");
      },
      active(query) {
        query.where({ active: true });
      },
      available(query, shopId, startDate, endDate) {
        query
          // .leftJoinRelated('time_slots(reservedTimeSlots)')
          // .modifiers({
          //   reservedTimeSlots: query => query.modify('reserved', startDate, endDate)
          // })
          .joinRelated("section.shop")
          .where("section.shop_id", "=", shopId);
      },
    };
  }

  static get relationMappings() {
    return {
      user: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: __dirname + "/../../users/models/user.ts",
        join: {
          from: "slots.user_id",
          to: "users.id",
        },
      },
      section: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: __dirname + "/../../shops/models/section.ts",
        join: {
          from: "slots.section_id",
          to: "sections.id",
        },
      },
      time_slots: {
        relation: BaseModel.HasManyRelation,
        modelClass: __dirname + "/timeSlot.ts",
        join: {
          from: "slots.id",
          to: "time_slots.slot_id",
        },
      },
    };
  }
}

export interface Slot {
  id: number;
  created_at: Date;
  updated_at: Date;
  capacity: number;
  active: boolean;
  sku: string;
  section_id: number;
  user_id: number;
  uuid: string;

  user: User;
  section: Section;
}
