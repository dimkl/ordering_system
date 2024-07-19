/**
 * @integration-test true
 * @data-factory true
 */
import type { Knex } from "knex";

import setupModels from "../../../shared/setupModels";

describe("POST /slots", () => {
  let knex: Knex;
  beforeAll(() => (knex = setupModels()));
  beforeEach(() => knex.raw("truncate users, time_slots, slots, sections, shops cascade;"));
  afterAll(() => knex.destroy());

  it("creates and returns a slot", async () => {
    const section = await DataFactory.createSection();

    const response = await request
      .post("/slots")
      .send({
        section_id: section.id,
        sku: "slot-sku-1",
        capacity: 5,
        active: true
      })
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body).toMatchSnapshot({
      id: expect.any(String),
      created_at: expect.any(String),
      updated_at: expect.any(String),
      section_id: expect.any(String)
    });
    expect(response.body).toMatchObject({
      section_id: section.id,
      user_id: null,
      sku: "slot-sku-1"
    });
  });

  it("creates and returns bulk slots", async () => {
    const section = await DataFactory.createSection();
    const otherSection = await DataFactory.createSection({}, section.shop, section.user);

    const data = [
      {
        section_id: section.id,
        user_id: section.user_id,
        sku: "slot-sku-1",
        capacity: 5,
        active: true
      },
      {
        section_id: otherSection.id,
        sku: "slot-sku-2",
        capacity: 10,
        active: false
      }
    ];

    const response = await request.post("/slots").send(data).set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
    expect(response.body[0]).toMatchSnapshot({
      id: expect.any(String),
      created_at: expect.any(String),
      updated_at: expect.any(String),
      section_id: expect.any(String),
      user_id: expect.any(String)
    });
    expect(response.body[0]).toMatchObject({
      section_id: section.id,
      user_id: section.user_id,
      sku: "slot-sku-1"
    });
    expect(response.body[1]).toMatchSnapshot({
      id: expect.any(String),
      created_at: expect.any(String),
      updated_at: expect.any(String),
      section_id: expect.any(String)
    });
    expect(response.body[1]).toMatchObject({
      section_id: otherSection.id,
      user_id: null,
      sku: "slot-sku-2"
    });

    expect(response.body.map((d) => d.section_id)).toEqual(
      expect.arrayContaining([section.id, otherSection.id])
    );
  });

  it("throws validation error for required properties", async () => {
    const response = await request.post("/slots").send({}).set("Accept", "application/json");

    expect(response.status).toBe(400);
    expect(response.body).toMatchSnapshot();
  });

  it("throws validation error for not existing section_id", async () => {
    const section = await DataFactory.createSection();

    const response = await request
      .post("/slots")
      .send({
        section_id: section.id.substring(0, -1) + "1",
        user_id: section.user_id,
        sku: "slot-sku-1",
        capacity: 1
      })
      .set("Accept", "application/json");

    expect(response.status).toBe(400);
    expect(response.body).toMatchSnapshot();
  });

  it("throws validation error for not existing user_id", async () => {
    const section = await DataFactory.createSection();

    const response = await request
      .post("/slots")
      .send({
        section_id: section.id,
        user_id: section.user_id.substring(0, -1) + "1",
        sku: "slot-sku-1",
        capacity: 1
      })
      .set("Accept", "application/json");

    expect(response.status).toBe(400);
    expect(response.body).toMatchSnapshot();
  });

  it("omits additional properties", async () => {
    const section = await DataFactory.createSection();

    const response = await request
      .post("/slots")
      .send({
        user_id: section.user_id,
        section_id: section.id,
        sku: "slot-sku-1",
        created_at: "1680046371850",
        capacity: 1
      })
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body.created_at).not.toEqual("1680046371850");
    expect(response.body.user_id).toEqual(section.user_id);
    expect(response.body.section_id).toEqual(section.id);
    expect(response.body.sku).toEqual("slot-sku-1");
  });
});
