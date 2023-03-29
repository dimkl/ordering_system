const Router = require("koa-router");

const ControllerFactory = require("../shared/controllerFactory");

const productListController = require("./controllers/products/list");
const productCreateController = require("./controllers/products/create");
const productAddIngredientController = require("./controllers/products/addIngredient");

const ingredientListController = require("./controllers/ingredients/list");
const ingredientCreateController = require("./controllers/ingredients/create");

const categoryListController = require("./controllers/categories/list");
const categoryCreateController = require("./controllers/categories/create");

const variationCreateController = require("./controllers/variations/create");

const loadProduct = require("./helpers/loadProduct");
const loadIngredient = require("./helpers/loadIngredient");
const loadCategory = require("./helpers/loadCategory");

const router = new Router();

// setup params
router
  .param("product_id", loadProduct)
  .param("ingredient_id", loadIngredient)
  .param("category_id", loadCategory);

router.post(
  "/products/ingredients",
  ControllerFactory.create({
    ...productAddIngredientController,
    scopes: ["urn:products:c"],
  })
);

router.get(
  "/products",
  ControllerFactory.create({
    ...productListController,
    scopes: ["urn:products:r"],
  })
);
router.get(
  "/products/:product_id",
  ControllerFactory.create({
    ...productListController,
    scopes: ["urn:products:r"],
  })
);
router.post(
  "/products",
  ControllerFactory.create({
    ...productCreateController,
    scopes: ["urn:products:c"],
  })
);

router.post(
  "/variations",
  ControllerFactory.create({
    ...variationCreateController,
    scopes: ["urn:products:c"],
  })
);

router.get(
  "/ingredients",
  ControllerFactory.create({
    ...ingredientListController,
    scopes: ["urn:ingredients:r"],
  })
);
router.get(
  "/ingredients/:ingredient_id",
  ControllerFactory.create({
    ...ingredientListController,
    scopes: ["urn:ingredients:r"],
  })
);
router.post(
  "/ingredients",
  ControllerFactory.create({
    ...ingredientCreateController,
    scopes: ["urn:ingredients:c"],
  })
);

router.get(
  "/categories",
  ControllerFactory.create({
    ...categoryListController,
    scopes: ["urn:categories:r"],
  })
);
router.get(
  "/categories/:category_id",
  ControllerFactory.create({
    ...categoryListController,
    scopes: ["urn:categories:r"],
  })
);
router.post(
  "/categories",
  ControllerFactory.create({
    ...categoryCreateController,
    scopes: ["urn:categories:c"],
  })
);

module.exports = router;
