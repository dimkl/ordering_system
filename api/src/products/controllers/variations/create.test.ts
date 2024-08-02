/**
 * @integration-test true
 * @data-factory true
 */

import type { Knex } from "knex";

import { ulid } from "ulid";

import setupModels from "../../../shared/setupModels";

describe("POST /variations", () => {
  let knex: Knex;
  beforeAll(() => (knex = setupModels()));
  beforeEach(() => knex.raw("truncate users, products, ingredients cascade;"));
  afterAll(() => knex.destroy());

  it("create product variation", async () => {
    const { ingredient, product } = await DataFactory.createProductIngredient();
    const ingredient2 = await DataFactory.createIngredient({
      title: "Ingredient 2"
    });
    await DataFactory.createProductIngredient({}, product, ingredient2);

    const response = await request
      .post(`/${apiVersion}/variations`)
      .send({
        title: "Variation",
        description: "Variation description",
        sku: `${product.sku}-1`,
        variant_id: product.id,
        ingredients: [ingredient.id]
      })
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: expect.any(String),
      created_at: expect.any(String),
      updated_at: expect.any(String),
      title: product.title,
      sku: product.sku,
      variant_id: null,
      description: product.description,
      ingredients: expect.arrayContaining([
        expect.objectContaining({
          id: ingredient.id,
          created_at: expect.any(String),
          updated_at: expect.any(String),
          suitable_for_diet: "all",
          allergen: false
        }),
        expect.objectContaining({
          id: ingredient2.id,
          created_at: expect.any(String),
          updated_at: expect.any(String),
          suitable_for_diet: "all",
          allergen: false
        })
      ]),
      variations: expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          created_at: expect.any(String),
          updated_at: expect.any(String),
          title: "Variation",
          variant_id: product.id,
          sku: `${product.sku}-1`,
          description: "Variation description",
          ingredients: expect.arrayContaining([
            expect.objectContaining({
              id: ingredient.id,
              created_at: expect.any(String),
              updated_at: expect.any(String),
              suitable_for_diet: "all",
              allergen: false
            })
          ])
        })
      ])
    });
    expect(response.body.ingredients.length).toBe(2);
    expect(response.body.variations.length).toBe(1);
    expect(response.body.variations[0].ingredients.length).toBe(1);
  });

  it("throws 422 when variant is an existing variation", async () => {
    const { ingredient, product } = await DataFactory.createProductIngredient();
    const variation = await DataFactory.createProduct(
      {
        variant_id: product.id,
        sku: "product-code-1-1"
      },
      product.shop,
      product.user
    );
    const ingredient2 = await DataFactory.createIngredient({
      title: "Ingredient 2"
    });
    await DataFactory.createProductIngredient({}, product, ingredient2);
    const response = await request
      .post(`/${apiVersion}/variations`)
      .send({
        title: "Variation",
        description: "Variation description",
        sku: `${variation.sku}-1`,
        variant_id: variation.id,
        ingredients: [ingredient.id]
      })
      .set("Accept", "application/json");

    expect(response.status).toBe(422);
    expect(response.body).toMatchSnapshot();
  });

  it("throws 400 when no ingredients provided", async () => {
    const { product } = await DataFactory.createProductIngredient();

    const response = await request
      .post(`/${apiVersion}/variations`)
      .send({
        title: "Variation",
        description: "Variation description",
        sku: `${product.sku}-1`,
        variant_id: product.id,
        ingredients: []
      })
      .set("Accept", "application/json");

    expect(response.status).toBe(400);
    expect(response.body).toMatchSnapshot();
  });

  it("throws 404 for not existing ingredient_id", async () => {
    const product = await DataFactory.createProduct();
    const response = await request
      .post(`/${apiVersion}/variations`)
      .send({
        title: "Variation",
        description: "Variation description",
        sku: `${product.sku}-1`,
        variant_id: product.id,
        ingredients: ["ing_" + ulid()]
      })
      .set("Accept", "application/json");

    expect(response.status).toBe(404);
  });

  it("throws 404 for not existing product_id", async () => {
    const ingredient = await DataFactory.createIngredient();
    const response = await request
      .post(`/${apiVersion}/variations`)
      .send({
        title: "Variation",
        description: "Variation description",
        sku: "aloha-1",
        variant_id: "prd_" + ulid(),
        ingredients: [ingredient.id]
      })
      .set("Accept", "application/json");

    expect(response.status).toBe(404);
  });

  it("omits additional properties", async () => {
    const { ingredient, product } = await DataFactory.createProductIngredient();

    const response = await request
      .post(`/${apiVersion}/variations`)
      .send({
        title: "Variation",
        description: "Variation description",
        sku: `${product.sku}-1`,
        variant_id: product.id,
        ingredients: [ingredient.id],
        created_at: "1680046371850"
      })
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body.created_at).not.toEqual("1680046371850");
    expect(response.body.id).toEqual(product.id);

    const variation = response.body.variations[0];
    expect(variation.description).toEqual("Variation description");
    expect(variation.ingredients[0].id).toEqual(ingredient.id);
  });
});
