import type { Knex } from "knex";

import { categoriIds } from "../seed-constants";

export async function seed(knex: Knex) {
  await knex("categories").insert([
    {
      title: "Starters",
      description: "Starters description",
      id: categoriIds.Starters
    },
    {
      title: "Breakfast",
      description: "Breakfast description",
      id: categoriIds.Breakfast
    },
    {
      title: "Main Menu",
      description: "Main Menu description",
      id: categoriIds.Main
    },
    {
      title: "Dessert",
      description: "Dessert description",
      id: categoriIds.Dessert
    },
    {
      title: "Beverage",
      description: "Beverage description",
      id: categoriIds.Beverage
    }
  ]);
}
