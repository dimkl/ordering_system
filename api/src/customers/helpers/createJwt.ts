import type { Secret } from "jsonwebtoken";

import jsonwebtoken from "jsonwebtoken";
import type { Algorithm } from "jsonwebtoken";

import { Customer } from "../models/customer";

const JWT_ALGORITHM = (process.env.JWT_ALGORITHM || "RS256") as Algorithm;
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || "1h";
const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY as Secret;

// function intersection(setA, setB) {
//   setB = new Set(setB);
//   return [...new Set(
//     [...setA].filter(element => setB.has(element))
//   )];
// }

export async function createJwt(customerId: string, { role = "customer" } = {}) {
  const customer = await Customer.query()
    .modify("tokenColumns")
    .where({ id: customerId })
    .first()
    .throwIfNotFound();

  // const allowedScopes = intersection(customer.scopes, scopes);
  const allowedScopes = customer.scopes.join(" ");

  const payload = {
    ...customer,
    role,
    sub: customerId,
    scopes: allowedScopes
  };

  const access_token = await jsonwebtoken.sign(payload, JWT_PRIVATE_KEY, {
    expiresIn: JWT_EXPIRATION,
    algorithm: JWT_ALGORITHM
  });

  return { role, access_token, scopes: allowedScopes };
}
