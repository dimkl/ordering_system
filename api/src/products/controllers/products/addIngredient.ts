import type { Context } from "koa";

import schema from "../../schemas/productIngredient.create.json";
import { ProductIngredient, Ingredient, Product } from "../../models";

const handler = async (ctx: Context) => {
  // @ts-expect-error validatedData are added as part of the request validation
  const { ingredients, shop_id, ...data } = ctx.request.validatedData;

  let prdIngr = [data];
  if (ingredients.length) {
    // TODO: validate that shop id exists in request

    ingredients.forEach((ingr) => {
      ingr.shop_id = shop_id;
    });

    const createdIngredients = await Ingredient.query()
      .modify("publicInsertColumns")
      .insert(ingredients as Ingredient[]);

    prdIngr = createdIngredients.map((ingr) => {
      return { ...data, ingredient_id: ingr.id };
    });
  }

  await ProductIngredient.query().insert(prdIngr);

  ctx.body = await Product.findWithIngredients(data.product_id);
};

export { schema, handler };
