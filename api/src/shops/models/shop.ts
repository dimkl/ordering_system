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
          .withGraphJoined("products")
          .withGraphJoined("products.ingredients")
          .where("quantity", ">", 0);
      }
    };
  }

  static get relationMappings() {
    return {
      products: {
        relation: BaseModel.ManyToManyRelation,
        modelClass: __dirname + "/../../products/models/product",
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

  get idPrefix() {
    return "shp";
  }

  openingDate(date: Date): Date | undefined {
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

  closingDate(date): Date | undefined {
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

  isOpen(startDate: Date, endDate?: Date): boolean {
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

  openInMinutes(): number {
    if (!this.opening_time) return 0;
    if (!this.closing_time) return 0;

    let [hours, minutes, seconds] = this.opening_time.split(":");
    const openingTimeInSeconds =
      (Date.UTC(1970, 1, 1, Number(hours) || 0, Number(minutes) || 0, Number(seconds) || 0) /
        1000) >>
      0;
    [hours, minutes, seconds] = this.closing_time.split(":");
    const closingTimeInSeconds =
      (Date.UTC(1970, 1, 1, Number(hours) || 0, Number(minutes) || 0, Number(seconds) || 0) /
        1000) >>
      0;

    return closingTimeInSeconds / 60 - openingTimeInSeconds / 60;
  }

  // Default time_slot duration in minutes
  get default_time_slot_duration() {
    return 60;
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
  opening_days: number[];
  manager_id: number;

  user?: User;
}
