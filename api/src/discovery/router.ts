import type { Context } from "koa";

import { DiscoveryApiFactory } from "@dimkl/ajv-discovery-api";
import Router from "koa-router";

export const router = new Router();

const discoveryApi = DiscoveryApiFactory.getInstance();

router.get("/discovery", (ctx: Context) => {
  ctx.body = { schemas: discoveryApi.getSchemas() };
});
