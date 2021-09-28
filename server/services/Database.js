const path = require("path");
const fs = require("fs");
const sqlite3 = require("sqlite3");
const Knex = require("knex");
const EventEmitter = require("events");

async function createDatabase() {
  const dbPath = process.env.DATA_DIR || path.join(process.cwd(), "./data");
  const dbFilename = path.join(dbPath, "./bmx-clubby-timing.sqlite");
  console.log(dbFilename);
  if (!fs.existsSync(dbPath)) fs.mkdirSync(dbPath)
  await new Promise((resolve, reject) => {
    new sqlite3.Database(dbFilename, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => (err ? reject(err) : resolve()));
  });
  const knex = Knex({
    client: "sqlite3",
    useNullAsDefault: true,
    connection: {
      filename: dbFilename,
    },
    migrations: {
      tableName: "migrations",
    },
  });

  //Migrate
  await knex.migrate.latest({ directory: path.join(__dirname, "..", "..", "migrations") });

  //Insert default Track
  let dbRow = {
    name: "Manly",
    gateTransponderCode: "9992",
    loops: JSON.stringify([
      { name: "Hill", minTime: 1000, maxTime: 3000 },
      { name: "Finish", minTime: 3000, maxTime: 80000 },
    ]),
  };
  await knex("tracks").insert(dbRow);

  //Insert default Decoder
  dbRow = {
    ip: "127.0.0.2",
    port: "5403",
  };
  await knex("decoders").insert(dbRow);

  return knex;
}

module.exports = async () => {
  const eventBus = new EventEmitter();
  const knex = await createDatabase();
  const decoderMessages = () => knex("decoder_messages");
  const decoders = () => knex("decoders");
  const tracks = () => knex("tracks");
  const passings = () => knex("passings");
  const timings = () => knex("timings");

  return {
    async decoderMessageInsert(string) {
      return await decoderMessages().insert({ message: string });
    },
    async decoderGet() {
      return (await decoders().select().limit(1))[0] || null;
    },
    async tracksGet() {
      return (
        (
          await tracks()
            .select()
            .limit(1)
            .then((r) => r.map((x) => ({ ...x, loops: JSON.parse(x.loops) })))
        )[0] || null
      );
    },
    async tracksUpsert({ id, name, gateTransponderCode, loops }) {
      const dbRow = {id: "1", name, gateTransponderCode, loops: JSON.stringify(loops) };
      return await tracks().insert(dbRow).onConflict("id").merge();
    },

    async addPassing({ transponder, isGate, time }) {
      const dbRow = { transponder, isGate, time };
      return await passings().insert(dbRow);
    },
    async addTiming({ transponder, gate, splits, finish }) {
      const split1 = splits[0];
      const split2 = splits[1];
      const split3 = splits[2];
      const dbRow = { transponder, split1, split2, split3, splits: JSON.stringify(splits), gate, finish };
      return await timings()
        .insert(dbRow)
        .onConflict(["transponder", "gate"])
        .merge()
        .then((r) => {
          eventBus.emit("timing", { transponder, split1, split2, split3, splits, gate, finish });
          return r;
        });
    },

    getTimings({ limit = 30 } = {}) {
      return timings().select().limit(limit).orderBy("id", "desc");
    },
    async decoderUpsert({ id, ip, port }) {
      const dbRow = { id: 1, ip, port };
      console.log(dbRow);
      return await decoders().insert(dbRow).onConflict(["id"]).merge();
    },

    onTiming(handler) {
      eventBus.on("timing", handler);
    },
  };
};
