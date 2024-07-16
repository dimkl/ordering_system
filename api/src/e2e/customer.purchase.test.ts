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
    const { section, user, ...slot } = await DataFactory.createSlot();
    await DataFactory.createProductAvailability({}, {}, section.shop, user);
    await DataFactory.createProductAvailability({}, {}, section.shop, user);

    let response;
    // 1. create customer
    response = await request
      .post("/customers")
      .send({
        first_name: "First",
        last_name: "Customer",
        email: "customer@example.com",
        password: "123456"
      })
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    const customerId = response.body.id;

    // 2. reserve time_slot
    response = await request
      .post(`/time_slots/reserve`)
      .send({
        customer_id: customerId,
        slot_id: slot.uuid,
        started_at: "2022-04-23T22:00:00.000Z"
      })
      .set("Accept", "application/json");
    expect(response.status).toBe(200);
    const timeSlotId = response.body.uuid;

    // 3. retrieve shop menu
    response = await request
      .get(`/shops/${section.shop_id}/menu`)
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body.products.length).toBe(2);
    const [product1, product2] = response.body.products;

    // 4. create order with order items
    response = await request
      .post(`/orders`)
      .send({ customer_id: customerId, time_slot_id: timeSlotId })
      .set("Accept", "application/json");
    expect(response.status).toBe(200);
    expect(response.body.state).toBe("draft");
    const orderId = response.body.id;

    response = await request
      .post(`/order_items`)
      .send({ order_id: orderId, product_id: product1.uuid })
      .set("Accept", "application/json");
    expect(response.status).toBe(200);

    response = await request
      .post(`/order_items`)
      .send({ order_id: orderId, product_id: product2.uuid })
      .set("Accept", "application/json");
    expect(response.status).toBe(200);
    const orderItems = response.body.order_items;

    // 5. places order
    response = await request.post(`/orders/${orderId}/place`).set("Accept", "application/json");
    expect(response.status).toBe(200);
    expect(response.body.state).toBe("placed");
    expect(response.body.order_items[0].state).toBe("placed");
    expect(response.body.order_items[1].state).toBe("placed");

    // 6. user-chef creates order_item
    response = await request
      .post(`/order_items/${orderItems[0].id}/process`)
      .set("Accept", "application/json");
    expect(response.status).toBe(200);
    expect(response.body.state).toBe("processing");
    expect(response.body.order_items[0].state).toBe("prepared");

    response = await request
      .post(`/order_items/${orderItems[1].id}/process`)
      .set("Accept", "application/json");
    expect(response.status).toBe(200);
    expect(response.body.state).toBe("processing");
    expect(response.body.order_items[1].state).toBe("prepared");

    // 7. user-waiter serves order_item
    response = await request
      .post(`/order_items/${orderItems[0].id}/deliver`)
      .set("Accept", "application/json");
    expect(response.status).toBe(200);
    expect(response.body.state).toBe("processing");
    expect(response.body.order_items[0].state).toBe("delivered");

    response = await request
      .post(`/order_items/${orderItems[1].id}/deliver`)
      .set("Accept", "application/json");
    expect(response.status).toBe(200);
    expect(response.body.state).toBe("delivered");
    expect(response.body.order_items[1].state).toBe("delivered");

    // 8. customer requests order payment
    response = await request
      .post(`/orders/${orderId}/requestPayment`)
      .set("Accept", "application/json");
    expect(response.status).toBe(200);
    expect(response.body.state).toBe("payment_requested");

    // 9. user-waiter invoices orders (add discount or extra charges)
    response = await request.post(`/orders/${orderId}/invoice`).set("Accept", "application/json");
    expect(response.status).toBe(200);
    expect(response.body.state).toBe("invoiced");

    // 10. customer pays order (trigger pg webhook)
    // response = await request.post(`/pg`)
    //   .set("Accept", "application/json");
    // expect(response.status).toBe(200);
    // expect(response.body.state).toBe('paid');
  });
});
