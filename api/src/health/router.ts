import type { Context } from "koa";
import Router from "koa-router";

import { ControllerFactory } from "../shared/controllerFactory";

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

router.get("/health", ControllerFactory.create({ handler }));
