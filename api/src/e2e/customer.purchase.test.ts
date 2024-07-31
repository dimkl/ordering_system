/**
 * @integration-test true
 * @data-factory true
 */
import type { Knex } from "knex";

import setupModels from "../shared/setupModels";

describe("Customer purchase flow", () => {
  let knex: Knex;
  beforeAll(() => (knex = setupModels()));
  beforeEach(() => knex.raw("truncate orders, order_items, customers, users, products cascade;"));
  afterAll(() => knex.destroy());

  it("completes process", async () => {
    const customer = await DataFactory.createCustomer();
    const { section, user, ...slot } = await DataFactory.createSlot();
    await DataFactory.createProductAvailability({}, {}, section.shop, user);
    await DataFactory.createProductAvailability({}, {}, section.shop, user);

    let response;

    // 1. reserve time_slot
    response = await request
      .post(`/${apiVersion}/time_slots`)
      .send({
        customer_id: customer.id,
        slot_id: slot.id,
        started_at: "2022-04-23T22:00:00.000Z"
      })
      .set("Accept", "application/json");
    expect(response.status).toBe(200);
    const timeSlotId = response.body.id;

    // 2. retrieve shop menu
    response = await request
      .get(`/${apiVersion}/shops/${section.shop_id}/menu`)
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body.products.length).toBe(2);
    const [product1, product2] = response.body.products;

    // 3. create order with order items
    response = await request
      .post(`/${apiVersion}/orders`)
      .send({ customer_id: customer.id, time_slot_id: timeSlotId })
      .set("Accept", "application/json");
    expect(response.status).toBe(200);
    expect(response.body.state).toBe("draft");
    const orderId = response.body.id;

    response = await request
      .post(`/${apiVersion}/order_items`)
      .send({ order_id: orderId, product_id: product1.id })
      .set("Accept", "application/json");
    expect(response.status).toBe(200);

    response = await request
      .post(`/${apiVersion}/order_items`)
      .send({ order_id: orderId, product_id: product2.id })
      .set("Accept", "application/json");
    expect(response.status).toBe(200);
    const orderItems = response.body.order_items;

    // 4. places order
    response = await request
      .post(`/${apiVersion}/orders/${orderId}/place`)
      .set("Accept", "application/json");
    expect(response.status).toBe(200);
    expect(response.body.state).toBe("placed");
    expect(response.body.order_items[0].state).toBe("placed");
    expect(response.body.order_items[1].state).toBe("placed");

    // 5. user-chef creates order_item
    response = await request
      .post(`/${apiVersion}/order_items/${orderItems[0].id}/process`)
      .set("Accept", "application/json");
    expect(response.status).toBe(200);
    expect(response.body.state).toBe("processing");
    expect(response.body.order_items[0].state).toBe("prepared");

    response = await request
      .post(`/${apiVersion}/order_items/${orderItems[1].id}/process`)
      .set("Accept", "application/json");
    expect(response.status).toBe(200);
    expect(response.body.state).toBe("processing");
    expect(response.body.order_items[1].state).toBe("prepared");

    // 6. user-waiter serves order_item
    response = await request
      .post(`/${apiVersion}/order_items/${orderItems[0].id}/deliver`)
      .set("Accept", "application/json");
    expect(response.status).toBe(200);
    expect(response.body.state).toBe("processing");
    expect(response.body.order_items[0].state).toBe("delivered");

    response = await request
      .post(`/${apiVersion}/order_items/${orderItems[1].id}/deliver`)
      .set("Accept", "application/json");
    expect(response.status).toBe(200);
    expect(response.body.state).toBe("delivered");
    expect(response.body.order_items[1].state).toBe("delivered");

    // 7. customer requests order payment
    response = await request
      .post(`/${apiVersion}/orders/${orderId}/requestPayment`)
      .set("Accept", "application/json");
    expect(response.status).toBe(200);
    expect(response.body.state).toBe("payment_requested");

    // 8. user-waiter invoices orders (add discount or extra charges)
    response = await request
      .post(`/${apiVersion}/orders/${orderId}/invoice`)
      .set("Accept", "application/json");
    expect(response.status).toBe(200);
    expect(response.body.state).toBe("invoiced");

    // 9. customer pays order (trigger pg webhook)
    // response = await request.post(`/${apiVersion}/pg`)
    //   .set("Accept", "application/json");
    // expect(response.status).toBe(200);
    // expect(response.body.state).toBe('paid');
  });
});
