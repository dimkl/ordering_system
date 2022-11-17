  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.up = function (knex) {
    return knex.schema
      .createTable('categories', function (table) {
        table.increments('id');
        table.timestamps(true, true);
        table.string('title', 255).notNullable().unique();
        table.string('description', 255);
        table.uuid('uuid').notNullable();
      });
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = function (knex) {
    return knex.schema.dropTable("categories");
  };
  