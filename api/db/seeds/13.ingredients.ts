import { v4 as uuidv4 } from "uuid";

exports.seed = async function (knex) {
  await knex("ingredients").insert([
    {
      title: "Ingredient 1",
      description: "Ingredient 1 description",
      uuid: uuidv4()
    }
  ]);
};
