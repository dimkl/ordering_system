/**
 * @integration-test true
 * @data-factory true
 */
describe("GET /slots/:shop_id/available/:slot_id?", () => {
  let knex;
  beforeAll(() => knex = require('../../../shared/setupModels')());
  beforeEach(() => knex.raw('truncate orders, order_items, customers, users, products, time_slots, slots cascade;'));
  afterAll(() => knex.destroy());

  it("returns all slots", async () => {
    const { section } = await DataFactory.createSlot();

    const response = await request.get(`/slots/${section.shop_id}/available`)
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

    const response = await request.get(`/slots/${slot.section.shop_id}/available/${slot.id}`)
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

    const response = await request.get(`/slots/${slot.section.shop_id}/available/${slot.id}`)
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
    const slot = await DataFactory.createSlot({ active: false });

    const response = await request.get(`/slots/${slot.section.shop_id}/available`)
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it("throws 404 when specified slot does not exist", async () => {
    const slot = await DataFactory.createSlot();

    const randomSlotId = Math.floor((Math.random() * 100));
    const response = await request.get(`/slots/${slot.section.shop_id}/available/${randomSlotId}`)
      .set("Accept", "application/json");

    expect(response.status).toBe(404);
  });
});