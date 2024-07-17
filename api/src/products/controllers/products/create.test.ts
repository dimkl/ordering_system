/**
 * @integration-test true
 * @data-factory true
 */
import type { Knex } from "knex";

import setupModels from "../../../shared/setupModels";

describe("POST /products", () => {
  let knex: Knex;
  beforeAll(() => (knex = setupModels()));
  beforeEach(() => knex.raw("truncate products, ingredients cascade;"));
  afterAll(() => knex.destroy());

  it("create product", async () => {
    const data = {
      title: `Title - ${(Math.random() * 100).toString()}`,
      sku: `sku-${(Math.random() * 100).toString()}`
    };

    const response = await request.post(`/products`).send(data).set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(expect.objectContaining(data));
  });

  it("create bulk products", async () => {
    const data = [
      {
        title: `Title - ${(Math.random() * 100).toString()}`,
        sku: `sku-${(Math.random() * 100).toString()}`
      },
      {
        title: `Title - ${(Math.random() * 100).toString()}`,
        sku: `sku-${(Math.random() * 100).toString()}`
      }
    ];

    const response = await request.post(`/products`).send(data).set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(
      expect.arrayContaining([expect.objectContaining(data[0]), expect.objectContaining(data[1])])
    );
  });
});
