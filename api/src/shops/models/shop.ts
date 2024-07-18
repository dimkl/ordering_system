import { BaseModel } from "../../shared/baseModel";
import schema from "../schemas/shop.json";

import type { User } from "../../users/models/user";

export class Shop extends BaseModel {
  id!: string;

  static get tableName() {
    return "shops";
  }

  static get jsonSchema() {
    return schema;
  }

  static get jsonAttributes() {
    return ["opening_days"];
  }

  static get public_columns() {
    return Object.keys(schema.properties);
  }

  static get modifiers() {
    return {
      ...super.modifiers,
      availableProducts(query) {
        query
          .join("product_availability", "product_availability.shop_id", "=", "shops.id")
          .withGraphJoined("products")
          .where("product_availability.quantity", ">", 0);
      }
    };
  }

  static get relationMappings() {
    return {
      products: {
        relation: BaseModel.ManyToManyRelation,
        modelClass: __dirname + "/../../products/models/product.ts",
        join: {
          from: "shops.id",
          through: {
            from: "product_availability.shop_id",
            to: "product_availability.product_id"
          },
          to: "products.id"
        }
      }
    };
  }

  openingDate(date) {
    if (!this.opening_time || !this.opening_days) return;
    if (!this.opening_days.includes(date.getUTCDay())) return;

    const year = date.getUTCFullYear();
    const month = date.getUTCMonth();
    const day = date.getUTCDate();

    const [hours, minutes, seconds] = this.opening_time.split(":");
    return new Date(
      Date.UTC(year, month, day, Number(hours) || 0, Number(minutes) || 0, Number(seconds) || 0)
    );
  }

  closingDate(date) {
    if (!this.closing_time || !this.opening_days) return;
    if (!this.opening_days.includes(date.getUTCDay())) return;

    const year = date.getUTCFullYear();
    const month = date.getUTCMonth();
    let day = date.getUTCDate();

    const [hours, minutes, seconds] = this.closing_time.split(":");

    // when closing at early morning hours, move day to next
    const openingHours = Number((this.opening_time || "").split(":")[0]);
    if (openingHours && openingHours >= Number(hours)) day += 1;

    return new Date(
      Date.UTC(year, month, day, Number(hours) || 0, Number(minutes) || 0, Number(seconds) || 0)
    );
  }

  isOpen(startDate, endDate?) {
    if (endDate && startDate > endDate) return false;

    const isBetween = (date, start, end) => date >= start && date <= end;

    // startDate is before opening or after closing
    if (!this.openingDate(startDate)) return false;
    if (!isBetween(startDate, this.openingDate(startDate), this.closingDate(startDate)))
      return false;

    if (!endDate) return true;

    // endDate is before opening or after closing
    if (!this.closingDate(endDate)) return false;
    if (!isBetween(endDate, this.openingDate(endDate), this.closingDate(endDate))) return false;

    return true;
  }
}

export interface Shop {
  id: string;
  created_at: Date;
  updated_at: Date;
  name: string;
  lat: number;
  lng: number;
  opening_time: string;
  closing_time: string;
  opening_days: string;
  manager_id: number;

  user?: User;
}
