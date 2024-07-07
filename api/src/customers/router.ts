import Router from "koa-router";

import { ControllerFactory } from "../shared/controllerFactory";

import * as listController from "./controllers/list";
import * as createController from "./controllers/create";
import * as updateController from "./controllers/update";
import * as deleteController from "./controllers/delete";
import * as loginController from "./controllers/login";
import * as signupController from "./controllers/signup";

import { loadCustomer } from "./helpers/loadCustomer";

export const router = new Router();

// setup params
router.param("customer_id", loadCustomer);

router.get(
  "/customers",
  ControllerFactory.create({ ...listController, scopes: ["urn:customers:r"] })
);
router.get(
  "/customers/:customer_id",
  ControllerFactory.create({ ...listController, scopes: ["urn:customers:r"] })
);
router.post(
  "/customers",
  ControllerFactory.create({ ...createController, scopes: ["urn:customers:c"] })
);
router.patch(
  "/customers/:customer_id",
  ControllerFactory.create({ ...updateController, scopes: ["urn:customers:u"] })
);
router.delete(
  "/customers/:customer_id",
  ControllerFactory.create({ ...deleteController, scopes: ["urn:customers:d"] })
);

// actions
router.post("/customers/login", ControllerFactory.create({ ...loginController }));
router.post("/customers/signup", ControllerFactory.create({ ...signupController }));
