module.exports = function (fastify, opts, done) {
  fastify.get("/status", async function () {
    const result = await this.decoder.getStatus();
    return result;
  });

  fastify.put("/status", async function (request) {
    const { isConnected } = request.body;
    if (isConnected) {
      this.log.info("Connection decoder");
      await this.decoder.connect();
    } else {
      await this.decoder.destroy();
    }
    return this.decoder.getStatus();
  });

  fastify.get("/settings", async function () {
    const result = await this.db.decoderGet("1");
    return result;
  });

  fastify.post(
    "/settings",
    {
      schema: {
        body: {
          type: "object",
          required: ["ip", "port"],
          errorMessage: {
            required: {
              ip: "IP is required",
              port: "Port is required",
            },
            properties: {
              ip: "IP must look like an IP address (e.g 192.1.1.232)",
            },
          },
          properties: {
            ip: { type: "string", format: "ipv4" },
            port: { type: "number", minimum: 1000, maximum: 9999 },
          },
        },
      },
    },
    async function (request) {
      await this.decoder.setSettings({ ip: request.body.ip, port: parseInt(request.body.port) });
      const result = await this.db.decoderGet("1");
      return result;
    }
  );
  done();
};
