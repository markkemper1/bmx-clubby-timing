exports.up = function (knex) {
  return knex.schema.createTable("timings", function (table) {
    table.increments("id");
    table.string("transponder", 10).notNullable();
    table.integer("gate").notNullable();
    table.integer("split1").notNullable();
    table.integer("split2").default(null);
    table.integer("split3").default(null);
    table.json("splits");
    table.integer("finish").default(null);
    table.unique(["transponder", "gate"]);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("timings");
};
