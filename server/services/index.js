const Decoder = require("./DecoderCient");
const Database = require("./Database");
const DecoderManager = require("./DecoderManager");
const TimingManager = require("./TimingManager");
const faker = require("./fakeDecoderServer");

exports.init = async () => {
  const db = await Database();
  const decoder = DecoderManager({ db, Decoder: Decoder });
  let timingManager;
  const track = await db.tracksGet();
  if (track && track.loops) {
    timingManager = await TimingManager({ db, track });

    await decoder.init();

    decoder.onPassing(timingManager.handle);
  }

  return {
    db,
    decoder,
    timingManager,
  };
};
