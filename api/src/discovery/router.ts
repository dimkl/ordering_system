import type { Context } from "koa";

import { DiscoveryApiFactory } from "@dimkl/ajv-discovery-api";
import Router from "koa-router";

import { readFileSync } from "fs";

export const router = new Router();

const discoveryApi = DiscoveryApiFactory.getInstance();

router.get("/discovery", (ctx: Context) => {
  ctx.body = { schemas: discoveryApi.getSchemas() };
});

// I used module level variable to cache the file content and avoid reading it in every request
// TODO(dimkl): expose it from redocly or using koa-static instead of reading the file
const openAPIPreviewHtml = readFileSync(process.env.OPENAPI_PREVIEW_FILE_PATH || "").toString();

router.get("/openapi", (ctx: Context) => {
  ctx.type = "text/html";
  ctx.body = openAPIPreviewHtml;
});
