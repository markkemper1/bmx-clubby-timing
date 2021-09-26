module.exports = function (fastify, opts, done) {
  fastify.get("/", async function () {
    return await this.db.tracksGet();
  });

  fastify.post(
    "/",
    {
      schema: {
        body: {
          type: "object",
          required: ["name", "gateTransponderCode"],
          errorMessage: {
            required: {
              name: "Name is required",
              gateTransponderCode: "Gate Transponder Code is required",
            },
          },
          properties: {
            name: { type: "string" },
            gateTransponderCode: { type: "string" },
          },
        },
      },
    },
    async function (request) {
      await this.db.tracksUpsert({
        name: request.body.name,
        gateTransponderCode: request.body.gateTransponderCode,
        loops: request.body.loops.map((x) => ({
          name: x.name,
          minTime: parseInt(x.minTime),
          maxTime: parseInt(x.maxTime),
        })),
      });

      const result = await this.db.tracksGet();
      return result;
    }
  );
  done();
};
