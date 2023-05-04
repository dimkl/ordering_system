import type { Knex } from "knex";

import { v4 as uuidv4 } from "uuid";

export async function seed(knex: Knex) {
  await knex("categories").insert([
    {
      title: "Starters",
      description: "Starters description",
      uuid: uuidv4(),
      id: 1,
    },
    {
      title: "Breakfast",
      description: "Breakfast description",
      uuid: uuidv4(),
      id: 2,
    },
    {
      title: "Main Menu",
      description: "Main Menu description",
      uuid: uuidv4(),
      id: 3,
    },
    {
      title: "Dessert",
      description: "Dessert description",
      uuid: uuidv4(),
      id: 4,
    },
    {
      title: "Beverage",
      description: "Beverage description",
      uuid: uuidv4(),
      id: 5,
    },
  ]);
}
