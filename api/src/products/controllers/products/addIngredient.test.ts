/**
 * @integration-test true
 * @data-factory true
 */
import type { Knex } from "knex";

import { ulid } from "ulid";

import setupModels from "../../../shared/setupModels";

describe("POST /products/ingredients", () => {
  let knex: Knex;
  beforeAll(() => (knex = setupModels()));
  beforeEach(() => knex.raw("truncate users, products, ingredients cascade;"));
  afterAll(() => knex.destroy());

  it("create product ingredient", async () => {
    const product = await DataFactory.createProduct();
    const ingredient = await DataFactory.createIngredient({ shop_id: product.shop_id });

    const response = await request
      .post(`/${apiVersion}/products/ingredients`)
      .send({
        ingredient_id: ingredient.id,
        product_id: product.id
      })
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: product.id,
      created_at: expect.any(String),
      updated_at: expect.any(String),
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
      .post(`/${apiVersion}/products/ingredients`)
      .send({
        ingredient_id: "ing_" + ulid(),
        product_id: product.id
      })
      .set("Accept", "application/json");

    expect(response.status).toBe(404);
  });

  it("throws 404 for not existing product_id", async () => {
    const ingredient = await DataFactory.createIngredient();
    const response = await request
      .post(`/${apiVersion}/products/ingredients`)
      .send({
        ingredient_id: ingredient.id,
        product_id: "prd_" + ulid()
      })
      .set("Accept", "application/json");

    expect(response.status).toBe(404);
  });

  it("omits additional properties", async () => {
    const product = await DataFactory.createProduct();
    const ingredient = await DataFactory.createIngredient({ shop_id: product.shop_id });

    const response = await request
      .post(`/${apiVersion}/products/ingredients`)
      .send({
        ingredient_id: ingredient.id,
        product_id: product.id,
        created_at: "1680046371850"
      })
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body.created_at).not.toEqual("1680046371850");
    expect(response.body.id).toEqual(product.id);
    expect(response.body.ingredients[0].id).toEqual(ingredient.id);
  });
});
