const uuid = require('uuid');

const knex = require("../../src/shared/knex");

class DataFactory {
  static get knex() {
    return knex;
  }

  static async createCustomer(options = {}) {
    return knex('customers').returning('id').insert({
      first_name: "Dimitris",
      last_name: "Klouvas",
      email: "dimitris.klouvas@gmail.com",
      password: "$2b$10$R4dVWhqUOPMM.87/xnUdEuQxMNLVjbDlolPd5Vw0RK5CgQjIhGYbO",
      uuid: uuid.v4(),
      ...options
    });
  }

  static async createProduct(options) {
    return knex('products').returning('id').insert({
      title: "Product",
      sku: "product-code-1",
      description: "Product description",
      uuid: uuid.v4(),
      ...options
    });
  }

  static async createOrder(options = {}, customer = {}, timeSlot = {}) {
    let customerId = customer.id;
    if (!customerId) {
      customerId = (await this.createCustomer(customer))[0].id
    }

    let timeSlotId = timeSlot.id;
    if (!timeSlotId) {
      timeSlotId = (await this.createTimeSlot(timeSlot, { ...customer, id: customerId }))[0].id
    }

    return knex('orders').returning('id').insert([
      { customer_id: customerId, time_slot_id: timeSlotId, state: 'draft', uuid: uuid.v4(), ...options },
    ]);
  }

  static async createOrderItem(options = {}, order = {}, product = {}, customer = {}) {
    let orderId = order.id;
    if (!orderId) {
      orderId = (await this.createOrder(order, customer))[0].id
    }

    let productId = product.id;
    if (!productId) {
      productId = (await this.createProduct(product))[0].id
    }

    return knex('order_items').returning('id').insert([
      { order_id: orderId, product_id: productId, state: 'draft', uuid: uuid.v4(), ...options }
    ]);
  }

  static async createUser(options = {}) {
    return knex('users').returning('id').insert({
      first_name: "Dimitris",
      last_name: "Klouvas",
      email: "dimitris.klouvas@gmail.com",
      password: "$2b$10$R4dVWhqUOPMM.87/xnUdEuQxMNLVjbDlolPd5Vw0RK5CgQjIhGYbO",
      uuid: uuid.v4(),
      ...options
    });
  }

  static async createShop(options = {}, user = {}) {
    let managerId = user.id;
    if (!managerId) {
      managerId = (await this.createUser(user))[0].id
    }

    return knex('shops').returning('id').insert({
      manager_id: managerId,
      name: 'Shop',
      uuid: uuid.v4(),
      ...options
    });
  }

  static async createSection(options = {}, shop = {}, user = {}) {
    let userId = user.id;
    if (!userId) {
      userId = (await this.createUser(user))[0].id
    }

    let shopId = shop.id;
    if (!shopId) {
      shopId = (await this.createShop(shop, { ...user, id: userId }))[0].id
    }

    return knex('sections').returning('id').insert({
      shop_id: shopId,
      user_id: userId,
      name: 'Section',
      sku: 'section-1',
      uuid: uuid.v4(),
      ...options
    });
  }

  static async createSlot(options = {}, section = {}, user = {}, shop = {}) {
    let userId = user.id;
    if (!userId) {
      userId = (await this.createUser(user))[0].id
    }

    let sectionId = section.id;
    if (!sectionId) {
      sectionId = (await this.createSection(section, shop, { ...user, id: userId }))[0].id
    }

    return knex('slots').returning('id').insert({
      section_id: sectionId,
      user_id: userId,
      sku: 'table-1',
      uuid: uuid.v4(),
      active: true,
      ...options
    });
  }

  static async createTimeSlot(options = {}, customer = {}, slot = {}, section = {}, user = {}, shop = {}) {
    let customerId = customer.id;
    if (!customerId) {
      customerId = (await this.createCustomer(customer))[0].id
    }

    let slotId = slot.id;
    if (!slotId) {
      slotId = (await this.createSlot(slot, section, user, shop))[0].id
    }

    return knex('time_slots').returning('id').insert({
      slot_id: slotId,
      customer_id: customerId,
      started_at: (new Date()).toISOString(),
      uuid: uuid.v4(),
      ...options
    });
  }
}

module.exports = DataFactory;