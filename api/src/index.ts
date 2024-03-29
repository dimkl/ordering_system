import dotenv from "dotenv";
dotenv.config({
  path: process.env.DOTENV_CONFIG_PATH,
  override: true,
});

import { DiscoveryApiFactory } from "@dimkl/ajv-discovery-api";

import setupModels from "./shared/setupModels";
import { isTestingEnv } from "./shared/helpers";
import { errorHandler } from "./shared/middlewares/errorHandler";
import definitionsSchema from "./shared/schemas/definitions.json";

import Koa from "koa";
import logger from "koa-logger";
import json from "koa-json";
import bodyParser from "koa-bodyparser";

import { router } from "./router";

// Add some shared schema defintions
const discoveryApi = DiscoveryApiFactory.getInstance();
discoveryApi.registerSchema(definitionsSchema);

const app = new Koa();

// middlewares
app.use(json());
if (!isTestingEnv()) {
  app.use(logger());
}
app.use(bodyParser());
// my middlewares
app.use(errorHandler());

// routes
app.use(router.routes());
app.use(router.allowedMethods());

setupModels();

// @ts-ignore
const PORT = parseInt(process.env.PORT || 3000);

export default app.listen(PORT, () => {
  if (!isTestingEnv()) console.log(`initialize application to port ${PORT}`);
});
