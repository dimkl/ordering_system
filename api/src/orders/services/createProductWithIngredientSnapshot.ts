import { Ingredient, Product } from "../../products/models";
import type { OrderItem } from "../models/orderItem";

type ProductWithIngredientSnapshot = OrderItem["product_snapshot"];

export class CreateProductWithIngredientSnapshot {
  #productId: string;

  constructor(productId: string) {
    this.#productId = productId;
  }

  async process(
    orderItem: OrderItem | undefined,
    ingredirentsDiff: string[]
  ): Promise<ProductWithIngredientSnapshot | undefined> {
    // @ts-expect-error ingredients are prefetched but the type is not correct
    const { ingredients, ...product } = await Product.findWithIngredients(this.#productId);
    if (!product) return;

    const ingredientsSnapshot = (ingredients || []).map((i) => {
      return { id: i.id, title: i.title };
    });

    const result = {
      product,
      ingredients: orderItem ? orderItem.product_snapshot : ingredientsSnapshot
    };

    if (ingredirentsDiff.length == 0) return result;

    const variationIngredientsIds = new Set(ingredirentsDiff.map((i) => i.replace(/-\+/gi, "")));
    const variationIngredients = await Ingredient.query().where({ id: variationIngredientsIds });

    if (!variationIngredients) return result;

    ingredirentsDiff.forEach((ing) => {
      const ingId = ing.replace(/-\+/gi, "");
      if (ing.startsWith("-")) {
        result.ingredients = result.ingredients.filter((i) => i.id !== ingId);
        return;
      }
      if (result.ingredients.find((i) => i.id === ingId)) {
        return;
      }

      const ingredient = variationIngredients.find((i) => i.id === ingId);
      result.ingredients.push(ingredient);
    });

    return result;
  }
}
