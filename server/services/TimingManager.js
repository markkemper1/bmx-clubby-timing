const TrackRiders = require("./TrackRiders");

module.exports = async function PassingManager({ db, track }) {
  const trackRiders = TrackRiders({ track });

  return {
    handle: async (message) => {
      const transponder = `${message.TRAN_CODE || message.TRANSPONDER}`;
      const passing = { transponder, time: message.RTC_TIME, isGate: transponder == track.gateTransponderCode };

      await db.addPassing(passing);

      if (passing.isGate) {
        trackRiders.gateDrop(passing);
        return;
      }

      const timing = trackRiders.passing(passing);

      if (!timing) return;

      db.addTiming(timing);
      /* Save passing passing */
    },
  };
};
