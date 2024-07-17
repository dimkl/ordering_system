import type { Customer } from "../../src/customers/models/customer";
import type { Product, Ingredient, ProductIngredient } from "../../src/products/models";
import type { Order, OrderItem } from "../../src/orders/models";
import type { User } from "../../src/users/models/user";
import type { Slot, TimeSlot } from "../../src/availability/models";
import type { Shop, Section, ProductAvailability, Holiday } from "../../src/shops/models";

import { v4 as uuidv4 } from "uuid";
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
        id: ulid(),
        ...options
      });

    return customers[0];
  }

  static async createIngredient(options?: Partial<Ingredient>) {
    const ingredients = await knex("ingredients")
      .returning("*")
      .insert<Ingredient[]>({
        title: "Ingredient",
        description: "Ingredient description",
        id: ulid(),
        ...options
      });

    return ingredients[0];
  }

  static async createProduct(options?: Partial<Product>) {
    const products = await knex("products")
      .returning("*")
      .insert<Product[]>({
        title: "Product",
        sku: "product-code-1",
        description: "Product description",
        uuid: uuidv4(),
        uid: ulid(),
        ...options
      });

    return products[0];
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
      id: ulid()
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
      product = await this.createProduct(product);
    }

    const order_items = await knex("order_items")
      .returning("*")
      .insert<OrderItem[]>([
        {
          order_id: order.id,
          product_id: product.id,
          state: "draft",
          id: ulid(),
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
      id: ulid()
    };
    const users = await knex("users")
      .returning("*")
      .insert<User[]>({
        ...defaultValues,
        ...options
      });

    return users[0];
  }

  static async createShop(options?: Partial<Shop>, user?: Partial<User>) {
    if (!user?.id) {
      user = await this.createUser(user);
    }

    const shops = await knex("shops")
      .returning("*")
      .insert<Shop[]>({
        manager_id: user.id,
        name: "Shop",
        id: ulid(),
        opening_time: "15:00",
        closing_time: "23:00",
        opening_days: [0, 1, 2, 3, 4, 5, 6],
        ...options
      });

    return { ...shops[0], user } as Shop;
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
      shop = await this.createShop(shop, user);
    }

    const sections = await knex("sections")
      .returning("*")
      .insert<Section[]>({
        shop_id: shop.id,
        user_id: user.id,
        name: "Section",
        sku: "section-1",
        id: ulid(),
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
        id: ulid(),
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
        id: ulid(),
        ...options
      });

    return { ...time_slots[0], slot, customer } as TimeSlot;
  }

  static async createHoliday(
    options?: Partial<Holiday>,
    shop?: Partial<Shop>,
    user?: Partial<User>
  ) {
    if (!shop?.id) {
      shop = await this.createShop(shop, user);
    }

    const newYear = `${new Date().getUTCFullYear()}/12/31`;
    const holidays = await knex("holidays").insert<Holiday[]>({
      shop_id: shop.id,
      date: newYear,
      name: "New Year",
      id: ulid(),
      ...options
    });

    return { ...holidays[0], shop };
  }

  static async createProductAvailability(
    options?: Partial<ProductAvailability>,
    product?: Partial<Product>,
    shop?: Partial<Shop>,
    user?: Partial<User>
  ) {
    if (!shop?.id) {
      shop = await this.createShop(shop, user);
    }

    if (!product?.id) {
      product = await this.createProduct(product);
    }

    const productAvailability = await knex("product_availability").insert<ProductAvailability[]>({
      shop_id: shop.id,
      product_id: product.id,
      quantity: 2,
      id: ulid(),
      ...options
    });

    return { ...productAvailability[0], shop, product };
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
      id: ulid(),
      ...options
    });

    return { ...productIngredient[0], ingredient, product };
  }
}
