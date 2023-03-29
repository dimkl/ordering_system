const Router = require("koa-router");

const ControllerFactory = require("../shared/controllerFactory");

const menuController = require("./controllers/menu");
const listController = require("./controllers/list");

const loadShop = require("./helpers/loadShop");

const router = new Router();

router.param("shop_id", loadShop);

router.get(
  "/shops/:shop_id/menu",
  ControllerFactory.create({ ...menuController, scopes: ["urn:shops:m"] })
);
router.get(
  "/shops",
  ControllerFactory.create({ ...listController, scopes: ["urn:shops:r"] })
);
router.get(
  "/shops/:shop_id",
  ControllerFactory.create({ ...listController, scopes: ["urn:shops:r"] })
);

module.exports = router;
