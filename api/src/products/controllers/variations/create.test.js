/**
 * @integration-test true
 * @data-factory true
 */

const uuid = require('uuid');

describe("POST /variations", () => {
  let knex;
  beforeAll(() => knex = require('../../../shared/setupModels')());
  beforeEach(() => knex.raw('truncate products, ingredients cascade;'));
  afterAll(() => knex.destroy());

  it("create product variation", async () => {
    const { ingredient, product } = await DataFactory.createProductIngredient();
    const ingredient2 = await DataFactory.createIngredient({ title: 'Ingredient 2' });
    await DataFactory.createProductIngredient({}, product, ingredient2);

    const response = await request.post(`/variations`)
      .send({
        title: "Variation",
        description: "Variation description",
        sku: `${product.sku}-1`,
        variant_id: product.uuid,
        ingredients: [ingredient.uuid]
      })
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: expect.any(Number),
      created_at: expect.any(String),
      updated_at: expect.any(String),
      uuid: product.uuid,
      title: product.title,
      sku: product.sku,
      variant_id: null,
      description: product.description,
      ingredients: expect.arrayContaining([
        expect.objectContaining({
          uuid: ingredient.uuid,
          created_at: expect.any(String),
          updated_at: expect.any(String),
          suitable_for_diet: "all",
          allergen: false
        }),
        expect.objectContaining({
          uuid: ingredient2.uuid,
          created_at: expect.any(String),
          updated_at: expect.any(String),
          suitable_for_diet: "all",
          allergen: false
        })
      ]),
      variations: expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          created_at: expect.any(String),
          updated_at: expect.any(String),
          uuid: expect.any(String),
          title: "Variation",
          variant_id: product.id,
          sku: `${product.sku}-1`,
          description: "Variation description",
          ingredients: expect.arrayContaining([
            expect.objectContaining({
              uuid: ingredient.uuid,
              created_at: expect.any(String),
              updated_at: expect.any(String),
              suitable_for_diet: "all",
              allergen: false
            })
          ])
        })
      ]),
    });
    expect(response.body.ingredients.length).toBe(2);
    expect(response.body.variations.length).toBe(1);
    expect(response.body.variations[0].ingredients.length).toBe(1);
  });

  it("throws 404 for not existing ingredient_id", async () => {
    const product = await DataFactory.createProduct();
    const response = await request.post(`/variations`)
      .send({
        title: "Variation",
        description: "Variation description",
        sku: `${product.sku}-1`,
        variant_id: product.uuid,
        ingredients: [uuid.v4()]
      })
      .set("Accept", "application/json");

    expect(response.status).toBe(404);
  });

  it("throws 404 for not existing product_id", async () => {
    const ingredient = await DataFactory.createIngredient();
    const response = await request.post(`/variations`)
      .send({
        title: "Variation",
        description: "Variation description",
        sku: "aloha-1",
        variant_id: uuid.v4(),
        ingredients: [ingredient.uuid]
      })
      .set("Accept", "application/json");

    expect(response.status).toBe(404);
  });

  it("throws validation error with additional properties", async () => {
    const { ingredient, product } = await DataFactory.createProductIngredient();

    const response = await request.post(`/variations`)
      .send({
        title: "Variation",
        description: "Variation description",
        sku: `${product.sku}-1`,
        variant_id: product.uuid,
        ingredients: [ingredient.uuid],
        created_at: '2022-07-26T22:01:22.539Z'
      })
      .set("Accept", "application/json");

    expect(response.status).toBe(400);
    expect(response.body).toMatchSnapshot();
  });
});