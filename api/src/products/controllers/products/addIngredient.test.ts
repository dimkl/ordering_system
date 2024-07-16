/**
 * @integration-test true
 * @data-factory true
 */
import type { Knex } from "knex";

import { v4 as uuidv4 } from "uuid";
import { ulid } from "ulid";

import setupModels from "../../../shared/setupModels";

describe("POST /products/ingredients", () => {
  let knex: Knex;
  beforeAll(() => (knex = setupModels()));
  beforeEach(() => knex.raw("truncate products, ingredients cascade;"));
  afterAll(() => knex.destroy());

  it("create product ingredient", async () => {
    const ingredient = await DataFactory.createIngredient();
    const product = await DataFactory.createProduct();

    const response = await request
      .post(`/products/ingredients`)
      .send({
        ingredient_id: ingredient.id,
        product_id: product.uuid
      })
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: expect.any(Number),
      created_at: expect.any(String),
      updated_at: expect.any(String),
      uuid: product.uuid,
      title: product.title,
      description: product.description,
      ingredients: expect.arrayContaining([
        expect.objectContaining({
          id: ingredient.id,
          created_at: expect.any(String),
          updated_at: expect.any(String),
          suitable_for_diet: "all",
          allergen: false
        })
      ])
    });
    expect(response.body.ingredients.length).toBe(1);
  });

  it("throws 404 for not existing ingredient_id", async () => {
    const product = await DataFactory.createProduct();
    const response = await request
      .post(`/products/ingredients`)
      .send({
        ingredient_id: ulid(),
        product_id: product.uuid
      })
      .set("Accept", "application/json");

    expect(response.status).toBe(404);
  });

  it("throws 404 for not existing product_id", async () => {
    const ingredient = await DataFactory.createIngredient();
    const response = await request
      .post(`/products/ingredients`)
      .send({
        ingredient_id: ingredient.id,
        product_id: uuidv4()
      })
      .set("Accept", "application/json");

    expect(response.status).toBe(404);
  });

  it("omits additional properties", async () => {
    const ingredient = await DataFactory.createIngredient();
    const product = await DataFactory.createProduct();

    const response = await request
      .post(`/products/ingredients`)
      .send({
        ingredient_id: ingredient.id,
        product_id: product.uuid,
        created_at: "1680046371850"
      })
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body.created_at).not.toEqual("1680046371850");
    expect(response.body.uuid).toEqual(product.uuid);
    expect(response.body.ingredients[0].id).toEqual(ingredient.id);
  });
});
