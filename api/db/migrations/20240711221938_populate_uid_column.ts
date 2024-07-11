import { Knex } from "knex";

import { ulid } from "ulid";

const allTableNames = [
  "customers",
  "orders",
  "products",
  "order_items",
  "users",
  "shops",
  "sections",
  "slots",
  "time_slots",
  "holidays",
  "product_availability",
  "ingredients",
  "product_ingredients",
  "categories"
];

export async function up(knex: Knex): Promise<void> {
  await Promise.all(
    allTableNames.map((tableName) => {
      return knex.transaction(async (trx) => {
        const ids = (await knex(tableName).select("id").transacting(trx)) || [];
        try {
          await Promise.all(
            ids.map(({ id }) => {
              return knex(tableName).update({ uid: ulid() }).where({ id }).transacting(trx);
            })
          );
          await trx.commit();
        } catch (err) {
          await trx.rollback();
        }
      });
    })
  );
}

export async function down(knex: Knex): Promise<void> {
  await Promise.all(
    allTableNames.map((tableName) => {
      return knex.transaction(async (trx) => {
        const ids = (await knex(tableName).select("id").transacting(trx)) || [];
        try {
          await Promise.all(
            ids.map(({ id }) => {
              return knex(tableName).update({ uid: null }).where({ id }).transacting(trx);
            })
          );
          await trx.commit();
        } catch (err) {
          await trx.rollback();
        }
      });
    })
  );
}
