import Router from "koa-router";

import { createAuthController } from "../shared/controller";

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

router.post("/products/ingredients", createAuthController(productAddIngredientControllerParams));

router.get("/products", createAuthController(productListControllerParams));
router.get("/products/:product_id", createAuthController(productListControllerParams));
router.post("/products", createAuthController(productCreateControllerParams));

router.post("/variations", createAuthController(variationCreateControllerParams));

router.get("/ingredients", createAuthController(ingredientListControllerParams));
router.get("/ingredients/:ingredient_id", createAuthController(ingredientListControllerParams));
router.post("/ingredients", createAuthController(ingredientCreateControllerParams));

router.get("/categories", createAuthController(categoryListControllerParams));
router.get("/categories/:category_id", createAuthController(categoryListControllerParams));
router.post("/categories", createAuthController(categoryCreateControllerParams));
