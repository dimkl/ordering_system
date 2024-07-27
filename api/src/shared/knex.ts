import { knex as Knex } from "knex";
import * as knexConfig from "../../config/knexfile";

const NODE_ENV = process.env.NODE_ENV || "development";
export const knex = Knex(knexConfig[NODE_ENV]);
