const Router = require("koa-router");

const ControllerFactory = require("../shared/controllerFactory");

const listController = require("./controllers/list");
const createController = require("./controllers/create");
const updateController = require("./controllers/update");
const deleteController = require("./controllers/delete");
const loginController = require("./controllers/login");
const signupController = require("./controllers/signup");

const loadCustomer = require("./helpers/loadCustomer");

const router = new Router();

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
router.post(
  "/customers/login",
  ControllerFactory.create({ ...loginController })
);
router.post(
  "/customers/signup",
  ControllerFactory.create({ ...signupController })
);

module.exports = router;
