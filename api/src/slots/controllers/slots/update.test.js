/**
 * @integration-test true
 * @data-factory true
 */
describe("PATCH /slots/:slot_id", () => {
  let knex;
  beforeAll(() => knex = require('../../../shared/setupModels')());
  beforeEach(() => knex.raw('truncate users, time_slots, slots, sections, shops cascade;'));
  afterAll(() => knex.destroy());

  it("updates and returns updated slot", async () => {
    const slot = await DataFactory.createSlot();
    const section = await DataFactory.createSection({}, {}, { email: 'aloha@example.com' });

    const response = await request.patch(`/slots/${slot.uuid}`)
      .send({
        active: false,
        user_id: section.user.uuid,
        section_id: section.uuid
      })
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      "active": false,
      "created_at": slot.created_at.toISOString(),
      "updated_at": expect.any(String),
      "id": slot.id,
      "section_id": section.uuid,
      "sku": "table-1",
      "user_id": section.user.uuid,
      "uuid": slot.uuid
    });
    expect(slot.user_id).not.toEqual(section.user.id);
    expect(slot.section_id).not.toEqual(section.id);
    expect(slot.active).not.toEqual(false);
    const unixUpdatedAt = new Date(response.body.updated_at).getTime();
    expect(unixUpdatedAt).toBeGreaterThan(slot.updated_at.getTime());
  });

  it("does not have required properties", async () => {
    const slot = await DataFactory.createSlot();

    const response = await request.patch(`/slots/${slot.uuid}`)
      .send({})
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      "active": true,
      "created_at": slot.created_at.toISOString(),
      "updated_at": slot.updated_at.toISOString(),
      "id": slot.id,
      "section_id": slot.section.uuid,
      "sku": "table-1",
      "user_id": slot.user.uuid,
      "uuid": slot.uuid
    });
  });

  it("throws validation error with additional properties", async () => {
    const slot = await DataFactory.createSlot();

    const response = await request.patch(`/slots/${slot.uuid}`)
      .send({ created_at: Date.now() })
      .set("Accept", "application/json");

    expect(response.status).toBe(400);
    expect(response.body).toMatchSnapshot();
  });
});