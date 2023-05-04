import { knex as Knex } from "knex";

const NODE_ENV = process.env.NODE_ENV || "development";
import * as knexConfig from "../../config/knexfile";

// @ts-ignore
export const knex = Knex(knexConfig[NODE_ENV]);
