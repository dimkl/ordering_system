/**
 * @integration-test true
 * @data-factory true
 */
describe("PATCH /time_slots/:time_slot_id", () => {
  let knex;
  beforeAll(() => knex = require('../../../shared/setupModels')());
  beforeEach(() => knex.raw('truncate customers, users, time_slots, slots, sections, shops cascade;'));
  afterAll(() => knex.destroy());

  it("updates and returns updated time_slot", async () => {
    const timeSlot = await DataFactory.createTimeSlot();
    const slot = await DataFactory.createSlot({}, {}, { email: 'aloha@example.com' });
    const customer = await DataFactory.createCustomer({ email: 'timeSlot.update@example.com' });

    const response = await request.patch(`/time_slots/${timeSlot.uuid}`)
      .send({
        started_at: '2022-04-21T15:28:27.602Z',
        ended_at: '2022-05-21T15:28:27.602Z',
        customer_id: customer.uuid,
        slot_id: slot.uuid
      })
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      "started_at": '2022-04-21T15:28:27.602Z',
      "ended_at": '2022-05-21T15:28:27.602Z',
      "created_at": timeSlot.created_at.toISOString(),
      "updated_at": expect.any(String),
      "id": timeSlot.id,
      "customer_id": customer.uuid,
      "slot_id": slot.uuid,
      "uuid": timeSlot.uuid
    });
    expect(timeSlot.customer_id).not.toEqual(customer.id);
    expect(timeSlot.slot_id).not.toEqual(slot.id);
    expect(timeSlot.started_at).not.toEqual('2022-04-21T15:28:27.602Z');
    expect(timeSlot.ended_at).not.toEqual('2022-05-21T15:28:27.602Z');
    const unixUpdatedAt = new Date(response.body.updated_at).getTime();
    expect(unixUpdatedAt).toBeGreaterThan(timeSlot.updated_at.getTime());
  });

  it("does not have required properties", async () => {
    const timeSlot = await DataFactory.createTimeSlot();

    const response = await request.patch(`/time_slots/${timeSlot.uuid}`)
      .send({})
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      "started_at": timeSlot.started_at.toISOString(),
      "ended_at": null,
      "created_at": timeSlot.created_at.toISOString(),
      "updated_at": timeSlot.updated_at.toISOString(),
      "id": timeSlot.id,
      "customer_id": timeSlot.customer.uuid,
      "slot_id": timeSlot.slot.uuid,
      "uuid": timeSlot.uuid
    });
  });

  it("throws validation error with additional properties", async () => {
    const timeSlot = await DataFactory.createTimeSlot();

    const response = await request.patch(`/time_slots/${timeSlot.uuid}`)
      .send({ created_at: Date.now() })
      .set("Accept", "application/json");

    expect(response.status).toBe(400);
    expect(response.body).toMatchSnapshot();
  });
});