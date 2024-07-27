import { DiscoveryApiFactory } from "@dimkl/ajv-discovery-api";

// Keep setupModels as the 1st import since the env variables from the .env
// files are loaded in this.
import setupModels from "./shared/setupModels";
import { isTestingEnv } from "./shared/helpers";
import { errorHandler } from "./shared/middlewares/errorHandler";
import { cors } from "./shared/middlewares/cors";
import definitionsSchema from "./shared/schemas/definitions.json";

import Koa from "koa";
import logger from "koa-logger";
import json from "koa-json";
import bodyParser from "koa-bodyparser";

import { router } from "./router";
import { clerkMiddleware } from "@dimkl/clerk-koa";

// Add some shared schema defintions
const discoveryApi = DiscoveryApiFactory.getInstance();
discoveryApi.registerSchema(definitionsSchema);

const app = new Koa();

app.use(cors([process.env.CLIENT_URL || ""]));

// middlewares
app.use(json());
if (!isTestingEnv()) {
  app.use(logger());
}
app.use(bodyParser());
// my middlewares
app.use(errorHandler());
app.use(clerkMiddleware());

// routes
app.use(router.routes());
app.use(router.allowedMethods());

setupModels();

const PORT = parseInt(process.env.PORT || "3000");
export default app.listen(PORT, () => {
  if (!isTestingEnv()) console.log(`initialize application to port ${PORT}`);
});
