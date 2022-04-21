/**
 * @integration-test true
 * @data-factory true
 */
const Slot = require("../../models/slot");

describe("GET /slots", () => {
  beforeAll(() => require('../../../shared/setupModels')());
  beforeEach(() => Slot.knex().raw('truncate orders, order_items, customers, users, products, time_slots, slots cascade;'));
  afterAll(() => Slot.knex().destroy());

  it("returns all slots", async () => {
    await DataFactory.createSlot();

    const response = await request.get("/slots")
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1)
    expect(response.body[0]).toMatchSnapshot({
      id: expect.any(Number),
      section_id: expect.any(String),
      user_id: expect.any(String),
      uuid: expect.any(String),
      created_at: expect.any(String),
      updated_at: expect.any(String),
    });
  });

  it("returns specified slot", async () => {
    const slot = await DataFactory.createSlot();

    const response = await request.get("/slots/" + slot.id)
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body).toMatchSnapshot({
      id: expect.any(Number),
      section_id: expect.any(String),
      user_id: expect.any(String),
      uuid: expect.any(String),
      created_at: expect.any(String),
      updated_at: expect.any(String),
    });
  });

  it("returns specified slot using uuid", async () => {
    const slot = await DataFactory.createSlot();

    const response = await request.get("/slots/" + slot.uuid)
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body).toMatchSnapshot({
      id: expect.any(Number),
      section_id: expect.any(String),
      user_id: expect.any(String),
      uuid: expect.any(String),
      created_at: expect.any(String),
      updated_at: expect.any(String),
    });
  });

  it("returns empty list of slots when there are no slots", async () => {
    const response = await request.get("/slots")
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it("throws 404 when specified slot does not exist", async () => {
    const response = await request.get("/slots/" + Math.floor((Math.random() * 100)))
      .set("Accept", "application/json");

    expect(response.status).toBe(404);
  });
});