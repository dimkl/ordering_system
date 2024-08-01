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
    ingredirentsDiff: string[] = []
  ): Promise<ProductWithIngredientSnapshot | undefined> {
    const productWithIngredients = await Product.findWithIngredients(this.#productId);
    if (!productWithIngredients) return;

    // @ts-expect-error ingredients are prefetched but the type is not correct
    const ingredientsSnapshot = (productWithIngredients.ingredients || []).map((i) => {
      return { id: i.id, title: i.title };
    });

    const result = {
      product: productWithIngredients.toSnapshot(),
      ingredients: orderItem?.product_snapshot?.ingredients || ingredientsSnapshot
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
      if (ingredient) {
        result.ingredients.push(ingredient.toSnapshot());
      }
    });

    // sort ingredients using the sortable ids (can be used for checksum)
    result.ingredients = result.ingredients.sort((i) => i.id);

    return result;
  }
}
