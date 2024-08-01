import Router from "koa-router";

import { createController } from "../shared/controller";

import * as listControllerParams from "./controllers/list";
import * as createControllerParams from "./controllers/create";
import * as updateControllerParams from "./controllers/update";
import * as deleteControllerParams from "./controllers/delete";

import { loadCustomer } from "./helpers/loadCustomer";

export const router = new Router();

// setup params
router.param("customer_id", loadCustomer);

router.get(
  "/customers",
  createController({ ...listControllerParams, scopes: ["urn:customers:r"] })
);
router.get(
  "/customers/:customer_id",
  createController({ ...listControllerParams, scopes: ["urn:customers:r"] })
);
router.post(
  "/customers",
  createController({ ...createControllerParams, scopes: ["urn:customers:c"] })
);
router.patch(
  "/customers/:customer_id",
  createController({ ...updateControllerParams, scopes: ["urn:customers:u"] })
);
router.delete(
  "/customers/:customer_id",
  createController({ ...deleteControllerParams, scopes: ["urn:customers:d"] })
);
