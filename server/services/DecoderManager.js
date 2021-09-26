const { parse } = require("./decoding");
const EventEmitter = require("events");

module.exports = function DecoderManager({ db, Decoder }) {
  const eventBus = new EventEmitter();

  let settings, decoder;
  let error,
    isConnected = false;

  function onData(buf) {
    let result;
    try {
      result = parse(buf);
    } catch (e) {
      console.error("Error parsing message", buf.toString("base64"));
      db.decoderMessageInsert(buf.toString("base64"));
      return;
    }

    //Log other interesting stuff
    if (result.type != "STATUS" && result.type != "PASSING") {
      db.decoderMessageInsert(buf.toString("base64"));
    }

    if (result.type == "PASSING") {
      eventBus.emit("passing", result.fields);
    }
  }

  function onClose() {
    console.log("Decoder connection closed");
    isConnected = false;
  }

  function onError(err) {
    console.log("Decoder error", err);
    error = err;
    isConnected = false;
  }

  async function connectInternal() {
    if (decoder) await decoder.destroy();
    console.log("Connecting", settings);
    decoder = new Decoder(settings);
    decoder.onClose(onClose);
    decoder.onData(onData);
    decoder.onError(onError);
    isConnected = false;
    try {
      await decoder.connect();
      error = undefined;
      isConnected = true;
    } catch (e) {
      error = e;
      console.log(e);
    }
  }

  return {
    async init() {
      settings = await db.decoderGet();
      if (settings && settings.ip && settings.port) {
        await connectInternal();
      }
    },
    onPassing: (handler) => eventBus.on("passing", handler),
    getStatus() {
      return { isConnected, error, settings };
    },
    async setSettings({ ip, port }) {
      const changed = ip != settings.ip || port != settings.port;
      console.log("ip", ip, "port", port);
      await db.decoderUpsert({ id: "1", ip, port: parseInt(port) });
      if (changed) {
        settings = { ip, port };
        connectInternal();
      }
      return settings;
    },
    async destroy() {
      if (decoder) await decoder.destroy();
    },
    connect: connectInternal,
  };
};
