/**
 * @integration-test true
 */
const Customer = require("../models/customer");

describe("PATCH /customers/:customer_id", () => {
  beforeAll(() => require('../../shared/setupModels')());
  beforeEach(() => Customer.knex().raw('truncate customers, orders cascade;'));
  afterAll(() => Customer.knex().destroy());

  it("updates and returns updated customer", async () => {
    let customer = await Customer.query().insert({
      "first_name": "Dimitris",
      "last_name": "Klouvas",
      "email": "dimitris.klouvas@gmail.com",
      "password": "1234"
    });
    customer = await customer.$query();
    const response = await request.patch(`/customers/${customer.uuid}`)
      .send({
        "first_name": "Dimitris+2",
        "last_name": "Klouvas+2",
        "email": "dimitris.klouvas+2@gmail.com",
        "password": "123456"
      })
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      "email": "dimitris.klouvas+2@gmail.com",
      first_name: "Dimitris+2",
      last_name: "Klouvas+2",
      id: customer.id,
      uuid: customer.uuid,
      created_at: customer.created_at.toISOString(),
      updated_at: expect.any(String)
    });
    const unixUpdatedAt = new Date(response.body.updated_at).getTime();
    expect(unixUpdatedAt).toBeGreaterThan(customer.updated_at.getTime());
  });

  it("does not have required properties", async () => {
    const customer = await Customer.query().insert({
      "first_name": "Dimitris",
      "last_name": "Klouvas",
      "email": "dimitris.klouvas@gmail.com",
      "password": "1234"
    });

    const response = await request.patch(`/customers/${customer.uuid}`)
      .send({})
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body).toMatchSnapshot({
      id: expect.any(Number),
      uuid: expect.any(String),
      created_at: expect.any(String),
      updated_at: expect.any(String),
    });
  });

  it("throws validation error for unique email", async () => {
    const existingEmail = "customer@example.com";
    await Customer.query().insert({
      first_name: "First",
      last_name: "Customer",
      email: existingEmail,
      password: "1234"
    });
    const customer = await Customer.query().insert({
      "first_name": "Dimitris",
      "last_name": "Klouvas",
      "email": "dimitris.klouvas@gmail.com",
      "password": "1234"
    });

    const response = await request.patch(`/customers/${customer.uuid}`)
      .send({
        "first_name": "Dimitris",
        "last_name": "Klouvas",
        "email": existingEmail,
        "password": "1234"
      })
      .set("Accept", "application/json");

    expect(response.status).toBe(422);
    expect(response.body).toMatchSnapshot();
  });

  it("throws validation error with additional properties", async () => {
    const customer = await Customer.query().insert({
      "first_name": "Dimitris",
      "last_name": "Klouvas",
      "email": "dimitris.klouvas@gmail.com",
      "password": "1234"
    });

    const response = await request.patch(`/customers/${customer.uuid}`)
      .send({ created_at: Date.now() })
      .set("Accept", "application/json");

    expect(response.status).toBe(400);
    expect(response.body).toMatchSnapshot();
  });
});