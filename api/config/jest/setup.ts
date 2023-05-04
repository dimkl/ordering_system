import { knex } from "../../src/shared/knex";

export default async () => {
  // TODO: replace `npm run db:migrate` in package with the line above
  // Currently there is an issue with esm migration files, i will take a look when i have the time
  // await knex.migrate.latest();
  await knex.raw(
    "truncate customers, orders, order_items, users, products, time_slots, slots, shops, sections cascade;"
  );
};
