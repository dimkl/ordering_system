import Router from "koa-router";

import { createController } from "../shared/controller";

import * as productListControllerParams from "./controllers/products/list";
import * as productCreateControllerParams from "./controllers/products/create";
import * as productAddIngredientControllerParams from "./controllers/products/addIngredient";

import * as ingredientListControllerParams from "./controllers/ingredients/list";
import * as ingredientCreateControllerParams from "./controllers/ingredients/create";

import * as categoryListControllerParams from "./controllers/categories/list";
import * as categoryCreateControllerParams from "./controllers/categories/create";

import * as variationCreateControllerParams from "./controllers/variations/create";

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
  createController({
    ...productAddIngredientControllerParams,
    scopes: ["urn:products:c"]
  })
);

router.get(
  "/products",
  createController({
    ...productListControllerParams,
    scopes: ["urn:products:r"]
  })
);
router.get(
  "/products/:product_id",
  createController({
    ...productListControllerParams,
    scopes: ["urn:products:r"]
  })
);
router.post(
  "/products",
  createController({
    ...productCreateControllerParams,
    scopes: ["urn:products:c"]
  })
);

router.post(
  "/variations",
  createController({
    ...variationCreateControllerParams,
    scopes: ["urn:products:c"]
  })
);

router.get(
  "/ingredients",
  createController({
    ...ingredientListControllerParams,
    scopes: ["urn:ingredients:r"]
  })
);
router.get(
  "/ingredients/:ingredient_id",
  createController({
    ...ingredientListControllerParams,
    scopes: ["urn:ingredients:r"]
  })
);
router.post(
  "/ingredients",
  createController({
    ...ingredientCreateControllerParams,
    scopes: ["urn:ingredients:c"]
  })
);

router.get(
  "/categories",
  createController({
    ...categoryListControllerParams,
    scopes: ["urn:categories:r"]
  })
);
router.get(
  "/categories/:category_id",
  createController({
    ...categoryListControllerParams,
    scopes: ["urn:categories:r"]
  })
);
router.post(
  "/categories",
  createController({
    ...categoryCreateControllerParams,
    scopes: ["urn:categories:c"]
  })
);
