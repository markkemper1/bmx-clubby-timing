const write = require("./writer");
const parse = require("./parse");
test("Writes a record", () => {
  const input = {
    type: "PASSING",
    fields: {
      PASSING_NUMBER: 15450,
      TRAN_CODE: "KC-52885",
      RTC_TIME: 1625730857647,
      STRENGTH: 124,
      HITS: 79,
      FLAGS: 0,
      SPORT: 4,
      DECODER_ID: 273134,
    },
  };
  const result = write(input);
  console.log(result.toString("hex"));
  console.log(Buffer.from("jgI6AMaNrwAAAQABBFo8AAAKCEtDLTUyODg1BAiYO0X2l8YFAAUCfAAGAk8ACAIAABQBBIEE7ioEAI8=", "base64").toString("hex"));
  const roundTrip = parse(result);
  expect(roundTrip.type).toBe(input.type);
  expect(roundTrip.fields.PASSING_NUMBER).toBe(input.fields.PASSING_NUMBER);
  expect(roundTrip.fields.TRAN_CODE).toBe(input.fields.TRAN_CODE);
  expect(roundTrip.fields.RTC_TIME).toBe(input.fields.RTC_TIME);
  expect(roundTrip.fields.HITS).toBe(input.fields.HITS);
  expect(roundTrip.fields.FLAGS).toBe(input.fields.FLAGS);
  expect(roundTrip.fields.SPORT).toBe(input.fields.SPORT);
  expect(roundTrip.fields.DECODER_ID).toBe(input.fields.DECODER_ID);
});
