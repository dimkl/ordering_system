import type { Customer } from "../../src/customers/models/customer";
import type { Product, Ingredient, ProductIngredient } from "../../src/products/models";
import type { Order, OrderItem } from "../../src/orders/models";
import type { User } from "../../src/users/models/user";
import type { Slot, TimeSlot } from "../../src/availability/models";
import type { Shop, Section, Holiday } from "../../src/shops/models";

import { ulid } from "ulid";

import { knex } from "../../src/shared/knex";

export class DataFactory {
  static async createCustomer(options?: Partial<Customer>) {
    const customers = await knex("customers")
      .returning("*")
      .insert<Customer[]>({
        first_name: "Dimitris",
        last_name: "Klouvas",
        email: "dimitris.klouvas@gmail.com",
        password: "$2b$10$R4dVWhqUOPMM.87/xnUdEuQxMNLVjbDlolPd5Vw0RK5CgQjIhGYbO",
        id: "cus_" + ulid(),
        ...options
      });

    return customers[0];
  }

  static async createIngredient(options?: Partial<Ingredient>) {
    const ingredients = await knex("ingredients")
      .returning("*")
      .insert<Ingredient[]>({
        title: "Ingredient " + ulid(),
        description: "Ingredient description",
        id: "ing_" + ulid(),
        ...options
      });

    return ingredients[0];
  }

  static async createProduct(
    options?: Partial<Product>,
    shop?: Partial<Shop>,
    user?: Partial<User>
  ) {
    if (!shop?.id) {
      shop = await this.createShop(shop);
    }

    const products = await knex("products")
      .returning("*")
      .insert<Product[]>({
        title: "Product",
        sku: "product-code-1",
        description: "Product description",
        id: "prd_" + ulid(),
        quantity: 2,
        shop_id: shop.id,
        ...options
      });

    return { ...products[0], shop, user };
  }

  static async createOrder(
    options?: Partial<Order>,
    customer?: Partial<Customer>,
    timeSlot?: Partial<TimeSlot>
  ) {
    if (!customer?.id) {
      customer = await this.createCustomer(customer);
    }

    if (!timeSlot?.id) {
      timeSlot = await this.createTimeSlot(timeSlot, customer);
    }

    const defaultValues = {
      customer_id: customer?.id,
      time_slot_id: timeSlot.id,
      state: "draft",
      id: "ord_" + ulid()
    };

    const orders = await knex("orders")
      .returning("*")
      .insert<Order[]>([
        {
          ...defaultValues,
          ...options
        }
      ]);

    return { ...orders[0], customer, timeSlot } as Order;
  }

  static async createOrderItem(
    options?: Partial<OrderItem>,
    order?: Partial<Order>,
    product?: Partial<Product>,
    customer?: Partial<Customer>
  ) {
    if (!order?.id) {
      order = await this.createOrder(order, customer);
    }

    if (!product?.id) {
      const user = order?.timeSlot?.slot?.user;
      const shop = order?.timeSlot?.slot?.section?.shop;
      product = await this.createProduct(product, shop, user);
    }

    const order_items = await knex("order_items")
      .returning("*")
      .insert<OrderItem[]>([
        {
          order_id: order.id,
          product_id: product.id,
          state: "draft",
          id: "ort_" + ulid(),
          ...options
        }
      ]);

    return { ...order_items[0], product, order };
  }

  static async createUser(options?: Partial<User>) {
    const defaultValues = {
      first_name: "Dimitris",
      last_name: "Klouvas",
      email: "dimitris.klouvas@gmail.com",
      password: "$2b$10$R4dVWhqUOPMM.87/xnUdEuQxMNLVjbDlolPd5Vw0RK5CgQjIhGYbO",
      id: "usr_" + ulid()
    };
    const users = await knex("users")
      .returning("*")
      .insert<User[]>({
        ...defaultValues,
        ...options
      });

    return users[0];
  }

  static async createShop(options?: Partial<Shop>) {
    const shops = await knex("shops")
      .returning("*")
      .insert<Shop[]>({
        manager_id: null,
        name: "Shop",
        id: "shp_" + ulid(),
        opening_time: "15:00",
        closing_time: "23:00",
        opening_days: [0, 1, 2, 3, 4, 5, 6],
        ...options
      });

    return { ...shops[0] } as Shop;
  }

  static async createSection(
    options?: Partial<Section>,
    shop?: Partial<Shop>,
    user?: Partial<User>
  ) {
    if (!user?.id) {
      user = await this.createUser(user);
    }

    if (!shop?.id) {
      shop = await this.createShop(shop);
    }

    const sections = await knex("sections")
      .returning("*")
      .insert<Section[]>({
        shop_id: shop.id,
        user_id: user.id,
        name: "Section",
        sku: "section-1",
        id: "sec_" + ulid(),
        ...options
      });

    return { ...sections[0], shop, user } as Section;
  }

  static async createSlot(
    options?: Partial<Slot>,
    section?: Partial<Section>,
    user?: Partial<User>,
    shop?: Partial<Shop>
  ) {
    if (!user?.id) {
      user = await this.createUser(user);
    }

    if (!section?.id) {
      section = await this.createSection(section, shop, user);
    }

    const slots = await knex("slots")
      .returning("*")
      .insert<Slot[]>({
        section_id: section.id,
        user_id: user.id,
        sku: "table-1",
        id: "slt_" + ulid(),
        active: true,
        capacity: 1,
        ...options
      });

    return { ...slots[0], section, user } as Slot;
  }

  static async createTimeSlot(
    options?: Partial<TimeSlot>,
    customer?: Partial<Customer>,
    slot?: Partial<Slot>,
    section?: Partial<Section>,
    user?: Partial<User>,
    shop?: Partial<Shop>
  ) {
    if (!customer?.id) {
      customer = await this.createCustomer(customer);
    }

    if (!slot?.id) {
      slot = await this.createSlot(slot, section, user, shop);
    }

    const time_slots = await knex("time_slots")
      .returning("*")
      .insert<TimeSlot[]>({
        slot_id: slot.id,
        customer_id: customer.id,
        started_at: new Date().toISOString(),
        id: "tms_" + ulid(),
        ...options
      });

    return { ...time_slots[0], slot, customer } as TimeSlot;
  }

  static async createHoliday(options?: Partial<Holiday>, shop?: Partial<Shop>) {
    if (!shop?.id) {
      shop = await this.createShop(shop);
    }

    const newYear = `${new Date().getUTCFullYear()}/12/31`;
    const holidays = await knex("holidays").insert<Holiday[]>({
      shop_id: shop.id,
      date: newYear,
      name: "New Year",
      id: "hol_" + ulid(),
      ...options
    });

    return { ...holidays[0], shop };
  }

  static async createProductIngredient(
    options?: Partial<ProductIngredient>,
    product?: Partial<Product>,
    ingredient?: Partial<Ingredient>
  ) {
    if (!product?.id) {
      product = await this.createProduct(product);
    }

    if (!ingredient?.id) {
      ingredient = await this.createIngredient(ingredient);
    }

    const productIngredient = await knex("product_ingredients").insert<ProductIngredient[]>({
      ingredient_id: ingredient.id,
      product_id: product.id,
      id: "pri_" + ulid(),
      ...options
    });

    return { ...productIngredient[0], ingredient, product };
  }
}
