import Form from "@rjsf/chakra-ui";
import type { RJSFSchema } from "@rjsf/utils";
import validator from "@rjsf/validator-ajv8";

import { useAuth } from "@clerk/clerk-react";

import * as slotSchema from "../../schemas/slot.json";

const createSlot = (token: string, data: unknown) => {
  fetch(`${process.env.REACT_APP_API_BASE_URL}/2024-08-08/slots`, {
    mode: "cors",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token
    },
    body: JSON.stringify(data)
  }).catch(console.error);
};

export function SlotForm() {
  const { getToken } = useAuth();

  // @ts-expect-error incorrect type - will try to fix this later
  const onSubmit = async ({ formData }: unknown) => createSlot((await getToken()) || "", formData);

  return <Form schema={slotSchema as RJSFSchema} validator={validator} onSubmit={onSubmit} />;
}
