exports.seed = async function (knex) {
  const newYear = `${new Date().getUTCFullYear()}/12/31`;
  await knex('holidays').insert([
    { shop_id: 1, date: newYear, name: 'New Year' }
  ]);
};
