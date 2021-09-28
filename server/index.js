const Services = require("./services");
const Fastify = require("fastify");
const fastifyWebsocket = require("fastify-websocket");
const fastifyStatic = require("fastify-static");
const path = require("path");
const Sentry = require("@sentry/node");

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
      Sentry.captureException(error);
      console.log(error);
      reply.status(500).send("Server Error");
    }
  });

  fastify.decorate("db", services.db);
  fastify.decorate("decoder", services.decoder);

  const DecoderRouter = require("./DecoderRouter");
  fastify.register(DecoderRouter, { prefix: "/api/decoder" });

  fastify.register(require("./TrackRouter"), { prefix: "/api/tracks" });

  async function sendTimings(clients) {
    const latest = await services.db.getTimings();
    const message = JSON.stringify({ type: "timings", data: latest });
    for (let client of clients) {
      client.send(message);
    }
  }

  fastify.get("/ws", { websocket: true }, async (connection, request) => {
    sendTimings(new Set().add(connection.socket))
    connection.socket.on('message', message => {
      sendTimings(new Set().add(connection.socket))
    })
  });

  fastify.setNotFoundHandler(function (request, reply) {
    reply.status(200);
    reply.sendFile("index.html");
  });

  if (services.db) {
    services.db.onTiming(async (t) => {
      sendTimings(fastify.websocketServer.clients)
    });
  }

  return fastify;
}

// Run the server!
const start = async ({ port = 8999 } = {}) => {
  try {
    const services = await Services.init();
    const fastify = createServer(services);
    await fastify.ready();
    await new Promise((resolve) => fastify.listen(port, resolve));
    return fastify;
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

module.exports = (function () {
  let fastify;
  return {
    start: async (args) => {
      fastify = await start(args)
    },
    close() { return fastify.close() }
  }
})()

if (module == require.main) {
  start()
}