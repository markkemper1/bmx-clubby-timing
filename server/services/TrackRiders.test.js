const TrackRiders = require("./TrackRiders");
const track = {
  gate: "00-09992",
  loops: [
    { name: "Hill", minTime: 2000, maxTime: 3000 },
    { name: "Finish", minTime: 30000, maxTime: 70000 },
  ],
};
test("Hill crossing after 2000 and before 3000 should result in Hill Time", () => {
  const gate = new Date().getTime();
  const target = TrackRiders({ track });
  target.gateDrop({ time: gate });
  const result = target.passing({ transponder: "UA-01", time: gate + 2000 });
  expect(result.gate).toBe(gate);
  expect(result.splits.length).toBe(1);
  expect(result.splits[0]).toBe(2000);
});

test("Hill crossing before 2000 should NOT result in time", () => {
  const gate = new Date().getTime();
  const target = TrackRiders({ track });
  target.gateDrop({ time: gate });
  const result = target.passing({ transponder: "UA-01", time: gate + 1999 });
  expect(result).toBe(null);
});

test("Hill crossing after 3000 should NOT result in time", () => {
  const gate = new Date().getTime();
  const target = TrackRiders({ track });
  target.gateDrop({ time: gate });
  const result = target.passing({ transponder: "UA-01", time: gate + 3001 });
  expect(result).toBe(null);
});

test("Finish crossing after 30000 should result in time when rider has valid hill start time", () => {
  const gate = new Date().getTime();
  const target = TrackRiders({ track });
  target.gateDrop({ time: gate });
  target.passing({ transponder: "UA-01", time: gate + 3000 });
  const result = target.passing({ transponder: "UA-01", time: gate + 30000 });
  expect(result.gate).toBe(gate);
  expect(result.splits.length).toBe(2);
  expect(result.splits[0]).toBe(3000);
  expect(result.splits[1]).toBe(30000);
});

test("Finish crossing after 30000 should NOT result in time when rider has NO valid hill start time", () => {
  const gate = new Date().getTime();
  const target = TrackRiders({ track });
  target.gateDrop({ time: gate });
  const result = target.passing({ transponder: "UA-01", time: gate + 30000 });
  expect(result).toBe(null);
});

test("Second Finish crossing after 30000 should NOT result in time when rider has valid hill start time", () => {
  const gate = new Date().getTime();
  const target = TrackRiders({ track });
  target.gateDrop({ time: gate });
  target.passing({ transponder: "UA-01", time: gate + 3000 });
  let result = target.passing({ transponder: "UA-01", time: gate + 30000 });
  expect(result.gate).toBe(gate);
  expect(result.splits.length).toBe(2);
  expect(result.splits[0]).toBe(3000);
  expect(result.splits[1]).toBe(30000);
  result = target.passing({ transponder: "UA-01", time: gate + 40000 });
  expect(result).toBe(null);
});
