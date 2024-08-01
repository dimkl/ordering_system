import type { Context } from "koa";
import Router from "koa-router";

import { createController } from "../shared/controller";

export const router = new Router();

import { knex } from "../shared/knex";

export const handler = async (ctx: Context) => {
  try {
    await knex.raw("Select 1;");
    ctx.status = 200;
  } catch (err) {
    ctx.status = 503;
  }
};

router.get("/health", createController({ handler }));
