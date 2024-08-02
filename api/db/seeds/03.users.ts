import type { Knex } from "knex";

import bcrypt from "bcrypt";
import { userIds } from "../seed-constants";

const SALT_ROUNDS = 10;

async function createPassword(passwordLength = 10) {
  const password = [...Array(passwordLength)]
    .map(() => {
      // 33 - 126 is the alphanumeric range for latin chars with symbols
      const randomCharCode = (Math.random() * 100 + 33) % 126 >> 0;
      return String.fromCharCode(randomCharCode);
    })
    .join("");

  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function seed(knex: Knex) {
  await knex("users").insert([
    {
      first_name: "First",
      last_name: "Customer",
      email: "customer1@example.com",
      password: await createPassword(),
      id: userIds.First
    },
    {
      first_name: "Second",
      last_name: "Customer",
      email: "customer2@example.com",
      password: await createPassword(),
      id: userIds.Second
    }
  ]);
}
