const FakeDecoder = require("./decoding/FakeDecoder");
const writer = require("./decoding/writer");
const server = FakeDecoder();

const faker = Faker((f) => {
  server.send(
    writer(
      f.transponder == "00-09992"
        ? {
            type: "PASSING",
            fields: {
              TRANSPONDER: 9992,
              RTC_TIME: new Date().getTime(),
            },
          }
        : {
            type: "PASSING",
            fields: {
              TRAN_CODE: f.transponder,
              RTC_TIME: new Date().getTime(),
            },
          }
    )
  );
});

function Faker(onTrackEventHandler) {
  let id = 1;
  let gateDrop = null;
  const trackEvents = {};

  setInterval(function () {
    const time = new Date().getTime();
    const loopRandom = Math.random();
    const isGateDrop = loopRandom < 0.1;
    const transponder = isGateDrop ? 0 : "UX-" + parseInt(Math.random() * 5);
    const isOnTrack = trackEvents[transponder] && (time - trackEvents[transponder].gateDrop) / 1000 < 15;
    const isStartHill = !isGateDrop && !isOnTrack;
    const isFinish = !isGateDrop && !isStartHill;

    const passing = {
      transponder,
      isGateDrop,
      isStartHill,
      isFinish,
      time,
    };

    if (isGateDrop) {
      gateDrop = passing.time;
      onTrackEventHandler({
        transponder: "00-09992",
      });
    }

    //Need at least 1 gate drop
    if (!gateDrop) return;

    if (isStartHill) {
      const onTrackEvent = {
        id: id++,
        transponder: passing.transponder,
        gateDrop,
        hillTime: (passing.time - gateDrop) / 1000,
      };
      trackEvents[passing.transponder] = onTrackEvent;
      onTrackEventHandler(onTrackEvent);
    }

    if (isFinish && trackEvents[passing.transponder]) {
      const startHillEvent = trackEvents[passing.transponder];
      startHillEvent.lapTime = (time - startHillEvent.gateDrop) / 1000;
      onTrackEventHandler(startHillEvent);
      delete trackEvents[passing.transponder];
    }
  }, 500 + (Math.random() * 1000));
  return {};
}
