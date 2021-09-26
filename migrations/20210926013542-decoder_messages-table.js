exports.up = function (knex) {
  return knex.schema.createTable("decoder_messages", function (table) {
    table.increments("id");
    table.string("message", 1024).notNullable();
    table.timestamp("createdAt").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("decoder_messages");
};
