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

  it("returns shop menu with all products", async () => {
    const {
      shop: { user, ...shop },
      product: product1
    } = await DataFactory.createProductAvailability();
    const { product: product2 } = await DataFactory.createProductAvailability({}, {}, shop, user);

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
      products: expect.arrayContaining([
        expect.objectContaining({
          description: product1.description,
          id: product1.id,
          qr: null,
          sku: product1.sku,
          title: product1.title
        }),
        expect.objectContaining({
          description: product2.description,
          id: product2.id,
          qr: null,
          sku: product2.sku,
          title: product2.title
        })
      ])
    });
  });

  // TODO(dimkl): convert to left join and allow returning shop info without products
  it.skip("returns empty shop menu products when there are no products", async () => {
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
