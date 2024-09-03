import Form from "@rjsf/chakra-ui";
import type { RJSFSchema } from "@rjsf/utils";
import validator from "@rjsf/validator-ajv8";

import { useAuth } from "@clerk/clerk-react";

import * as sectionSchema from "../../schemas/section.json";

const createSection = (token: string, data: unknown) => {
  fetch(`${process.env.REACT_APP_API_BASE_URL}/2024-08-08/sections`, {
    mode: "cors",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token
    },
    body: JSON.stringify(data)
  }).catch(console.error);
};

export function SectionForm() {
  const { getToken } = useAuth();

  // @ts-expect-error incorrect type - will try to fix this later
  const onSubmit = async ({ formData }: unknown) =>
    createSection((await getToken()) || "", formData);

  return <Form schema={sectionSchema as RJSFSchema} validator={validator} onSubmit={onSubmit} />;
}
