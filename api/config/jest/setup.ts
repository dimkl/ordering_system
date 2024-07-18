import { knex } from "../../src/shared/knex";

export default async () => {
  await knex.migrate.latest();
  await knex.raw(
    "truncate customers, orders, order_items, users, products, time_slots, slots, shops, sections cascade;"
  );
};
