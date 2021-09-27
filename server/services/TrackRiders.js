const log = console;

module.exports = function ({ track }) {
  if (!track) throw new Error("Track option must be supplied");
  if (!track.loops) throw new Error("Track loops option must be supplied");
  if (!track.loops.length > 1) throw new Error("Must have at least 1 track loop defined");

  let lastGate;
  const riders = {};
  const firstLoop = track.loops[0];

  function formatResult(transponder, rider, delta) {
    const result = { transponder, splits: [], gate: rider.gate };

    for (let i = 0; i < track.loops.length; i++) {
      if (!rider.passings[i]) break;
      result.splits.push(rider.passings[i]);
    }

    result.finish = result.splits.length === track.loops.length ? delta : null;

    return result;
  }
  return {
    gateDrop({ time }) {
      log.info(`Gate drop, time: ${time}`);
      lastGate = time;
      return;
    },
    passing({ transponder, time }) {
      if (lastGate == null) {
        log.debug(`Ignoring ${transponder} gate has not dropped`);
        return;
      }

      const lastGateDelta = time - lastGate;

      log.debug(`Hill ${transponder}, delta: ${lastGateDelta}, gate: ${lastGate}, loop: ${firstLoop.minTime} - ${firstLoop.maxTime}`);

      //First check for rider starting a new lap
      if (lastGateDelta >= firstLoop.minTime && lastGateDelta <= firstLoop.maxTime) {
        log.info(`Hill ${transponder}, delta: ${lastGateDelta}, gate: ${lastGate}`);

        //Rider has started a new lap
        riders[transponder] = { id: `${lastGate}-${transponder}`, transponder, gate: lastGate, passings: [lastGateDelta] };
        return formatResult(transponder, riders[transponder], lastGateDelta);
      }

      const rider = riders[transponder];

      if (!rider) {
        log.debug(`No rider? ${transponder} loop not matched`);
        return null;
      }

      const delta = time - rider.gate;
      const loopIndex = track.loops.findIndex((x) => delta >= x.minTime && delta <= x.maxTime);

      //Ingore passing outside set time windows.
      if (loopIndex < 0) {
        log.debug(`Ignoring ${transponder} loop not matched`);
        return null;
      }

      //Ignore additional passings, only a gate will reset this rider
      if (rider.passings[loopIndex]) {
        log.debug(`Ignoring ${transponder} additional passing `);
        return null;
      }

      rider.passings[loopIndex] = delta;

      log.info((loopIndex + 1 < track.loops.length ? `Split` : `Lap`) + ` ${transponder}, delta: ${delta}, gate: ${rider.gate}`);

      return formatResult(transponder, riders[transponder], delta);
    },
  };
};
