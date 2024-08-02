import { ulid } from "ulid";

export const customerIds = {
  First: "cus_" + ulid(),
  Second: "cus_" + ulid()
};

export const userIds = {
  First: "usr_" + ulid(),
  Second: "usr_" + ulid()
};

export const categoriIds = {
  Starters: "cat_" + ulid(),
  Breakfast: "cat_" + ulid(),
  Main: "cat_" + ulid(),
  Dessert: "cat_" + ulid(),
  Beverage: "cat_" + ulid()
};

export const productIds = {
  Product1: "prd_" + ulid(),
  Variant1: "prd_" + ulid(),
  Variant2: "prd_" + ulid()
};

export const shopIds = {
  Shop1: "shp_" + ulid()
};

export const sectionIds = {
  Section1: "sec_" + ulid()
};

export const slotIds = {
  Table1: "slt_" + ulid()
};

export const timeSlotIds = {
  TimeSlot1: "tms_" + ulid()
};

export const orderIds = {
  Draft: "ord_" + ulid()
};

export const orderItemIds = {
  Item1: "ort_" + ulid()
};

export const ingredientIds = {
  Ingredient1: "ing_" + ulid()
};

export const holidayIds = {
  NewYear: "hol_" + ulid()
};

export const productIngredientIds = {
  Product1Ingredient1: "pri_" + ulid()
};
