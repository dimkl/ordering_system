import Form from "@rjsf/chakra-ui";
import type { RJSFSchema } from "@rjsf/utils";
import validator from "@rjsf/validator-ajv8";

import { useAuth } from "@clerk/clerk-react";

import * as ingredientSchema from "../schemas/ingredient.json";

const createIngredient = (token: string, data: unknown) => {
  fetch("http://localhost:3001/2024-08-08/ingredients", {
    mode: "cors",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token
    },
    body: JSON.stringify(data)
  }).catch(console.error);
};

export function IngredientForm() {
  const { getToken } = useAuth();

  // @ts-expect-error incorrect type - will try to fix this later
  const onSubmit = async ({ formData }: unknown) =>
    createIngredient((await getToken()) || "", formData);

  return <Form schema={ingredientSchema as RJSFSchema} validator={validator} onSubmit={onSubmit} />;
}
