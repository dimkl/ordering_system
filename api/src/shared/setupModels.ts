import { Model } from "objection";
import { knex } from "./knex";

export default () => {
  Model.knex(knex);
  return knex;
};
