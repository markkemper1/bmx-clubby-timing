exports.up = function (knex) {
  return knex.schema.createTable("passings", function (table) {
    table.increments("id");
    table.string("transponder", 10).notNullable();
    table.boolean("isGate").notNullable();
    table.timestamp("time").notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("passings");
};
