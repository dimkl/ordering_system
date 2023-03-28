/**
 * @integration-test true
 * @data-factory true
 */
describe("PATCH /customers/:customer_id", () => {
  let knex;
  beforeAll(() => knex = require('../../shared/setupModels')());
  beforeEach(() => knex.raw('truncate customers, orders cascade;'));
  afterAll(() => knex.destroy());

  it("updates and returns updated customer", async () => {
    const customer = await DataFactory.createCustomer();

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
    const customer = await DataFactory.createCustomer();

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
    const existingCustomer = await DataFactory.createCustomer();
    const newCustomer = await DataFactory.createCustomer({email: 'customer-update@example.com'});

    const response = await request.patch(`/customers/${newCustomer.uuid}`)
      .send({
        "first_name": "Dimitris",
        "last_name": "Klouvas",
        "email": existingCustomer.email,
        "password": "1234"
      })
      .set("Accept", "application/json");

    expect(response.status).toBe(422);
    expect(response.body).toMatchSnapshot();
  });

  it("omits additional properties", async () => {
    const customer = await DataFactory.createCustomer();

    const response = await request.patch(`/customers/${customer.uuid}`)
      .send({ created_at: "1680046371850", first_name: "aloha" })
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body.created_at).not.toEqual("1680046371850");
    expect(response.body.first_name).toEqual("aloha");
  });
});