/**
 * @integration-test true
 * @data-factory true
 */
import type { Knex } from "knex";

import { ulid } from "ulid";

import setupModels from "../../shared/setupModels";

describe("GET /shops/:shop_id/menu", () => {
  let knex: Knex;
  beforeAll(() => (knex = setupModels()));
  beforeEach(() => knex.raw("truncate users, shops, products cascade;"));
  afterAll(() => knex.destroy());

  it("returns shop menu with all products and their ingredients", async () => {
    const {
      shop: { user, ...shop },
      ...product1
    } = await DataFactory.createProduct();
    const product2 = await DataFactory.createProduct({}, shop, user);
    const { ingredient } = await DataFactory.createProductIngredient({}, product1);

    // Should be ignored from the response
    await DataFactory.createProductIngredient({ selection_type: "extra" }, product1);

    const response = await request
      .get(`/${apiVersion}/shops/${shop.id}/menu`)
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: shop.id,
      created_at: shop.created_at.toISOString(),
      updated_at: shop.updated_at.toISOString(),
      name: shop.name,
      lat: shop.lat,
      lng: shop.lng,
      opening_time: shop.opening_time,
      closing_time: shop.closing_time,
      opening_days: shop.opening_days,
      manager_id: shop.manager_id
    });
    expect(response.body.products).toMatchObject(
      expect.arrayContaining([
        expect.objectContaining({
          description: product1.description,
          id: product1.id,
          qr: null,
          sku: product1.sku,
          title: product1.title,
          ingredients: expect.arrayContaining([
            expect.objectContaining({
              allergen: false,
              created_at: expect.any(String),
              description: "Ingredient description",
              id: ingredient.id,
              selection_type: "primary",
              suitable_for_diet: "all",
              title: ingredient.title,
              updated_at: expect.any(String)
            })
          ])
        }),
        expect.objectContaining({
          description: product2.description,
          id: product2.id,
          qr: null,
          sku: product2.sku,
          title: product2.title,
          ingredients: []
        })
      ])
    );
  });

  it("returns shop menu with all products and their variations", async () => {
    const {
      shop: { user, ...shop },
      ...product1
    } = await DataFactory.createProduct();
    const product2 = await DataFactory.createProduct({}, shop, user);
    const { ingredient } = await DataFactory.createProductIngredient({}, product1);

    // create 2 variations of 1st product
    const variation1 = await DataFactory.createProduct({ variant_id: product1.id }, shop, user);
    const { ingredient: variationIngredient } = await DataFactory.createProductIngredient(
      {},
      variation1
    );
    // Should be ignored from the response
    await DataFactory.createProductIngredient({ selection_type: "extra" }, variation1);

    const variation2 = await DataFactory.createProduct({ variant_id: product1.id }, shop, user);

    const response = await request
      .get(`/${apiVersion}/shops/${shop.id}/menu`)
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: shop.id,
      created_at: shop.created_at.toISOString(),
      updated_at: shop.updated_at.toISOString(),
      name: shop.name,
      lat: shop.lat,
      lng: shop.lng,
      opening_time: shop.opening_time,
      closing_time: shop.closing_time,
      opening_days: shop.opening_days,
      manager_id: shop.manager_id
    });
    expect(response.body.products[0]).toMatchObject(
      expect.objectContaining({
        description: product1.description,
        id: product1.id,
        qr: null,
        sku: product1.sku,
        title: product1.title,
        variations: expect.arrayContaining([
          expect.objectContaining({
            description: variation1.description,
            id: variation1.id,
            qr: null,
            sku: variation1.sku,
            title: variation1.title,
            variant_id: product1.id,
            ingredients: [
              expect.objectContaining({
                allergen: false,
                created_at: expect.any(String),
                description: "Ingredient description",
                id: variationIngredient.id,
                selection_type: "primary",
                suitable_for_diet: "all",
                title: variationIngredient.title,
                updated_at: expect.any(String)
              })
            ]
          }),
          expect.objectContaining({
            description: variation2.description,
            id: variation2.id,
            qr: null,
            sku: variation2.sku,
            title: variation2.title,
            variant_id: product1.id,
            ingredients: []
          })
        ]),
        ingredients: expect.arrayContaining([
          expect.objectContaining({
            allergen: false,
            created_at: expect.any(String),
            description: "Ingredient description",
            id: ingredient.id,
            selection_type: "primary",
            suitable_for_diet: "all",
            title: ingredient.title,
            updated_at: expect.any(String)
          })
        ])
      })
    );
    expect(response.body.products[1]).toMatchObject(
      expect.objectContaining({
        description: product2.description,
        id: product2.id,
        qr: null,
        sku: product2.sku,
        title: product2.title,
        ingredients: [],
        variations: []
      })
    );
  });

  it("returns empty shop menu products when there are no products", async () => {
    const shop = await DataFactory.createShop();

    const response = await request
      .get(`/${apiVersion}/shops/${shop.id}/menu`)
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: shop.id,
      created_at: shop.created_at.toISOString(),
      updated_at: shop.updated_at.toISOString(),
      name: shop.name,
      lat: shop.lat,
      lng: shop.lng,
      opening_time: shop.opening_time,
      closing_time: shop.closing_time,
      opening_days: shop.opening_days,
      manager_id: shop.manager_id,
      products: []
    });
  });

  it("throws 404 when specified customer does not exist", async () => {
    const response = await request
      .get(`/${apiVersion}/shops/shp_${ulid()}/menu`)
      .set("Accept", "application/json");

    expect(response.status).toBe(404);
  });
});
