/**
 * @integration-test true
 * @data-factory true
 */
import type { Knex } from "knex";

import setupModels from "../../../shared/setupModels";

describe("GET /products", () => {
  let knex: Knex;
  beforeAll(() => (knex = setupModels()));
  beforeEach(() => knex.raw("truncate users, products, ingredients cascade;"));
  afterAll(() => knex.destroy());

  it("list products", async () => {
    const product = await DataFactory.createProduct();
    await DataFactory.createProductIngredient({}, product);

    const response = await request.get(`/${apiVersion}/products`).set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0]).toMatchObject({
      id: product.id,
      created_at: expect.any(String),
      updated_at: expect.any(String),
      title: product.title,
      description: product.description
    });
    expect(response.body[0].ingredients).toBeUndefined();
  });

  it("list products with included ingredients", async () => {
    const product = await DataFactory.createProduct();
    await DataFactory.createProductIngredient({}, product);

    const response = await request
      .get(`/${apiVersion}/products?include=ingredients`)
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0]).toMatchObject({
      id: product.id,
      created_at: expect.any(String),
      updated_at: expect.any(String),
      title: product.title,
      description: product.description
    });
    expect(response.body[0].ingredients.length).toBe(1);
  });

  it("throws 400 for not existing included param", async () => {
    const response = await request
      .get(`/${apiVersion}/products?include=variations`)
      .set("Accept", "application/json");

    expect(response.status).toEqual(400);
    expect(response.body).toMatchSnapshot();
  });
});
