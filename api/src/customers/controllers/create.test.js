/**
 * @integration-test true
 */
const Customer = require("../models/customer");


describe("POST /customers", () => {
  beforeAll(() => require('../../shared/setupModels')());
  beforeEach(() => Customer.knex().raw('truncate customers, orders cascade;'));
  afterAll(() => Customer.knex().destroy());

  it("creates and returns a customer", async () => {
    const response = await request.post("/customers")
      .send({
        "first_name": "Dimitris",
        "last_name": "Klouvas",
        "email": "dimitris.klouvas@gmail.com",
        "password": "1234"
      })
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body).toMatchSnapshot({
      id: expect.any(Number),
      created_at: expect.any(String),
      updated_at: expect.any(String),
    });
  });

  it("throws validation error for required properties", async () => {
    const response = await request.post("/customers")
      .send({})
      .set("Accept", "application/json");

    expect(response.status).toBe(400);
    expect(response.body).toMatchSnapshot();
  });

  it("throws validation error for unique email", async () => {
    const email = "customer@example.com";
    await Customer.query().insert({
      first_name: "First",
      last_name: "Customer",
      email: "customer@example.com",
      password: "1234"
    })

    const response = await request.post("/customers")
      .send({
        "first_name": "Dimitris",
        "last_name": "Klouvas",
        "email": email,
        "password": "1234"
      })
      .set("Accept", "application/json");

    expect(response.status).toBe(422);
    expect(response.body).toMatchSnapshot();
  });

  it("throws validation error with additional properties", async () => {
    const response = await request.post("/customers")
      .send({
        "first_name": "Dimitris",
        "last_name": "Klouvas",
        "email": "dimitris.klouvas@gmail.com",
        "password": "1234",
        "id": 2,
        "created_at": Date.now()
      })
      .set("Accept", "application/json");

    expect(response.status).toBe(400);
    expect(response.body).toMatchSnapshot();
  });
});