/**
 * @integration-test true
 * @data-factory true
 */

const uuid = require('uuid');

describe("POST /products/ingredients", () => {
  let knex;
  beforeAll(() => knex = require('../../../shared/setupModels')());
  beforeEach(() => knex.raw('truncate products, ingredients cascade;'));
  afterAll(() => knex.destroy());

  it("create product ingredient", async () => {
    const ingredient = await DataFactory.createIngredient();
    const product = await DataFactory.createProduct();

    const response = await request.post(`/products/ingredients`)
      .send({
        ingredient_id: ingredient.uuid,
        product_id: product.uuid,
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
          uuid: ingredient.uuid,
          created_at: expect.any(String),
          updated_at: expect.any(String),
          suitable_for_diet: "all",
          allergen: false
        })
      ]),
    });
    expect(response.body.ingredients.length).toBe(1);
  });

  it("throws 404 for not existing ingredient_id", async () => {
    const product = await DataFactory.createProduct();
    const response = await request.post(`/products/ingredients`)
      .send({
        ingredient_id: uuid.v4(),
        product_id: product.uuid,
      })
      .set("Accept", "application/json");

    expect(response.status).toBe(404);
  });

  it("throws 404 for not existing product_id", async () => {
    const ingredient = await DataFactory.createIngredient();
    const response = await request.post(`/products/ingredients`)
      .send({
        ingredient_id: ingredient.uuid,
        product_id: uuid.v4(),
      })
      .set("Accept", "application/json");

    expect(response.status).toBe(404);
  });

  it("throws validation error with additional properties", async () => {
    const ingredient = await DataFactory.createIngredient();
    const product = await DataFactory.createProduct();

    const response = await request.post(`/products/ingredients`)
      .send({
        ingredient_id: ingredient.uuid,
        product_id: product.uuid,
        created_at: '2022-07-26T22:01:22.539Z'
      })
      .set("Accept", "application/json");

    expect(response.status).toBe(400);
    expect(response.body).toMatchSnapshot();
  });
});