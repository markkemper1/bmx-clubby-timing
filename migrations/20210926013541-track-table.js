exports.up = function (knex) {
  return knex.schema.createTable("tracks", function (table) {
    table.increments("id");
    table.string("name", 255).notNullable();
    table.string("gateTransponderCode", 255).notNullable();
    table.json("loops").notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("tracks");
};
