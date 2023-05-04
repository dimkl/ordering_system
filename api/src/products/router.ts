import Router from "koa-router";

import { ControllerFactory } from "../shared/controllerFactory";

import * as productListController from "./controllers/products/list";
import * as productCreateController from "./controllers/products/create";
import * as productAddIngredientController from "./controllers/products/addIngredient";

import * as ingredientListController from "./controllers/ingredients/list";
import * as ingredientCreateController from "./controllers/ingredients/create";

import * as categoryListController from "./controllers/categories/list";
import * as categoryCreateController from "./controllers/categories/create";

import * as variationCreateController from "./controllers/variations/create";

import { loadProduct } from "./helpers/loadProduct";
import { loadIngredient } from "./helpers/loadIngredient";
import { loadCategory } from "./helpers/loadCategory";

export const router = new Router();

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
