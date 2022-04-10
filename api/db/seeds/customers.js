const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

async function createPassword(passwordLength = 10) {
  const password = [...Array(10)].map(() => {
    // 33 - 126 is the alphanumeric range for latin chars with symbols
    const randomCharCode = ((Math.random() * 100 + 33) % 126) >> 0;
    return String.fromCharCode(randomCharCode);
  }).join()

  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('customers').truncate()
  await knex('customers').insert([
    { first_name: 'First', last_name: 'Customer', email: 'customer1@example.com', password: await createPassword() },
    { first_name: 'Second', last_name: 'Customer', email: 'customer2@example.com', password: await createPassword() },
  ]);
};
