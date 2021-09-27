const net = require("net");
const log = console;

module.exports = function DecoderCient({ ip, port = 5403 }) {
  const socket = new net.Socket();
  log.debug(`Decoder setup, ip: ${ip}, port: ${port}`);

  return {
    async connect() {
      return new Promise((resolve, reject) => {
        const timer = setTimeout(function () {
          socket.destroy();
          reject("[ERROR] Attempt at connection exceeded timeout value");
        }, 1000);

        socket.connect(port, ip, function (e) {
          if (e) return reject(e);
          clearTimeout(timer);
          log.debug(`Connected to decoder, ip: ${ip}, port: ${port}`);
          resolve();
        });
      });
    },
    destroy() {
      log.debug(`Socket closed, ip: ${ip}, port: ${port}`);
      socket.destroy();
    },
    onData(handler) {
      socket.on("data", function (buf) {
        handler(buf);
      });
    },
    onError(handler) {
      socket.on("error", handler);
    },
    onClose(handler) {
      socket.on("close", handler);
    },
  };
};
