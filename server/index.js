const Services = require("./services");
const Fastify = require("fastify");
const fastifyWebsocket = require("fastify-websocket");
const fastifyStatic = require("fastify-static");
const path = require("path");

const buildDir = path.join(__dirname, "../build");

function createServer(services) {
  const fastify = Fastify({
    logger: false,
    ajv: {
      customOptions: { jsonPointers: true, allErrors: true },
      plugins: [require("ajv-errors")],
    },
  });

  fastify.register(fastifyStatic, {
    root: buildDir,
  });

  fastify.register(fastifyWebsocket, { options: { clientTracking: true } });
  fastify.setSchemaErrorFormatter(function (errors, dataVar) {
    this.log.error({ err: errors }, "Validation failed");
    // ... my formatting logic
    const error = new Error("Validation Error");
    errors.errors = errors;
    return error;
  });
  fastify.setErrorHandler(function (error, request, reply) {
    if (error.validation) {
      console.log(error.validation);
      reply.status(400).send({
        errors: error.validation.map((x) => x.message),
      });
    } else {
      console.log(error);
      reply.status(500).send("Server Error");
    }
  });

  fastify.decorate("db", services.db);
  fastify.decorate("decoder", services.decoder);

  const DecoderRouter = require("./DecoderRouter");
  fastify.register(DecoderRouter, { prefix: "/api/decoder" });

  fastify.register(require("./TrackRouter"), { prefix: "/api/tracks" });

  fastify.get("/ws", { websocket: true }, (connection, request) => {});

  fastify.setNotFoundHandler(function (request, reply) {
    reply.status(200);
    reply.sendFile("index.html");
  });

  if (services.db) {
    services.db.onTiming(async (t) => {
      const latest = await services.db.getTimings();
      for (let client of fastify.websocketServer.clients) {
        client.send(JSON.stringify({ type: "timings", data: latest }));
      }
    });
  }

  fastify.decoder.connect().catch((e) => {});

  return fastify;
}

// Run the server!
const start = async () => {
  try {
    const services = await Services.init();
    const fastify = createServer(services);
    await fastify.ready();
    return new Promise((resolve) => fastify.listen(8999, resolve));
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
module.exports = start();
