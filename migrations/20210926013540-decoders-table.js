exports.up = function (knex) {
  return knex.schema.createTable("decoders", function (table) {
    table.increments("id");
    table.string("ip", 255);
    table.integer("port").defaultTo(5403);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("decoders");
};
