
const supertest = require("supertest");

const app = require("../../index");
const Customer = require("../models/customer");

describe("GET /customers/:customer?", () => {
  let request = {};

  beforeAll(() => { request = supertest(app) });
  beforeEach(() => Customer.knex().raw('truncate customers, orders cascade;'));
  afterAll(() => {
    app.close();
    Customer.knex().destroy();
  });

  it("returns all customers", async () => {
    await Customer.query().insert({
      "first_name": "Dimitris",
      "last_name": "Klouvas",
      "email": "dimitris.klouvas@gmail.com",
      "password": "1234"
    })
    const response = await request.get("/customers")
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1)
    expect(response.body[0]).toMatchSnapshot({
      id: expect.any(Number)
    });
  });

  it("returns specified customer", async () => {
    const customer = await Customer.query().insert({
      "first_name": "Dimitris",
      "last_name": "Klouvas",
      "email": "dimitris.klouvas@gmail.com",
      "password": "1234"
    })
    const response = await request.get("/customers/" + customer.id)
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body).toMatchSnapshot({
      id: expect.anything()
    });
  });

  it("returns empty list of customers when there are no customers", async () => {
    const response = await request.get("/customers")
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it("throws 404 when specified customer does not exist", async () => {
    const response = await request.get("/customers/" + Math.floor((Math.random() * 100)))
      .set("Accept", "application/json");

    expect(response.status).toBe(404);
  });
});