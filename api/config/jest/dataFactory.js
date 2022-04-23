const uuid = require('uuid');

const knex = require("../../src/shared/knex");

class DataFactory {
  static async createCustomer(options = {}) {
    const customers = await knex('customers').returning('*').insert({
      first_name: "Dimitris",
      last_name: "Klouvas",
      email: "dimitris.klouvas@gmail.com",
      password: "$2b$10$R4dVWhqUOPMM.87/xnUdEuQxMNLVjbDlolPd5Vw0RK5CgQjIhGYbO",
      uuid: uuid.v4(),
      ...options
    });

    return customers[0];
  }

  static async createProduct(options) {
    const products = await knex('products').returning('*').insert({
      title: "Product",
      sku: "product-code-1",
      description: "Product description",
      uuid: uuid.v4(),
      ...options
    });

    return products[0];
  }

  static async createOrder(options = {}, customer = {}, timeSlot = {}) {
    if (!customer.id) {
      customer = await this.createCustomer(customer)
    }

    if (!timeSlot.id) {
      timeSlot = await this.createTimeSlot(timeSlot, customer);
    }

    const orders = await knex('orders').returning('*').insert([
      { customer_id: customer.id, time_slot_id: timeSlot.id, state: 'draft', uuid: uuid.v4(), ...options },
    ]);

    return { ...orders[0], customer, timeSlot }
  }

  static async createOrderItem(options = {}, order = {}, product = {}, customer = {}) {
    if (!order.id) {
      order = await this.createOrder(order, customer);
    }

    if (!product.id) {
      product = await this.createProduct(product);
    }

    const order_items = await knex('order_items').returning('*').insert([
      { order_id: order.id, product_id: product.id, state: 'draft', uuid: uuid.v4(), ...options }
    ]);

    return { ...order_items[0], product, order };
  }

  static async createUser(options = {}) {
    const users = await knex('users').returning('*').insert({
      first_name: "Dimitris",
      last_name: "Klouvas",
      email: "dimitris.klouvas@gmail.com",
      password: "$2b$10$R4dVWhqUOPMM.87/xnUdEuQxMNLVjbDlolPd5Vw0RK5CgQjIhGYbO",
      uuid: uuid.v4(),
      ...options
    });

    return users[0];
  }

  static async createShop(options = {}, user = {}) {
    if (!user.id) {
      user = await this.createUser(user);
    }

    const shops = await knex('shops').returning('*').insert({
      manager_id: user.id,
      name: 'Shop',
      uuid: uuid.v4(),
      opening_time: '15:00',
      closing_time: '23:00',
      opening_days: [0, 1, 2, 3, 4, 5, 6],
      ...options
    });

    return { ...shops[0], user };
  }

  static async createSection(options = {}, shop = {}, user = {}) {
    if (!user.id) {
      user = await this.createUser(user);
    }

    if (!shop.id) {
      shop = await this.createShop(shop, user);
    }

    const sections = await knex('sections').returning('*').insert({
      shop_id: shop.id,
      user_id: user.id,
      name: 'Section',
      sku: 'section-1',
      uuid: uuid.v4(),
      ...options
    });

    return { ...sections[0], shop, user };
  }

  static async createSlot(options = {}, section = {}, user = {}, shop = {}) {
    if (!user.id) {
      user = await this.createUser(user);
    }

    if (!section.id) {
      section = await this.createSection(section, shop, user);
    }

    const slots = await knex('slots').returning('*').insert({
      section_id: section.id,
      user_id: user.id,
      sku: 'table-1',
      uuid: uuid.v4(),
      active: true,
      capacity: 1,
      ...options
    });

    return { ...slots[0], section, user };
  }

  static async createTimeSlot(options = {}, customer = {}, slot = {}, section = {}, user = {}, shop = {}) {
    if (!customer.id) {
      customer = await this.createCustomer(customer);
    }

    if (!slot.id) {
      slot = await this.createSlot(slot, section, user, shop);
    }

    const time_slots = await knex('time_slots').returning('*').insert({
      slot_id: slot.id,
      customer_id: customer.id,
      started_at: (new Date()).toISOString(),
      uuid: uuid.v4(),
      ...options
    });

    return { ...time_slots[0], slot, customer };
  }
}

module.exports = DataFactory;