const parse = require("./parse");
test("Parse a record", () => {
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

  const inputBuffer = Buffer.from("jgI6AMaNrwAAAQABBFo8AAAKCEtDLTUyODg1BAiYO0X2l8YFAAUCfAAGAk8ACAIAABQBBIEE7ioEAI8=", "base64");
  const result = parse(inputBuffer);

  expect(result.type).toBe(input.type);
  expect(result.fields.PASSING_NUMBER).toBe(input.fields.PASSING_NUMBER);
  expect(result.fields.TRAN_CODE).toBe(input.fields.TRAN_CODE);
  expect(result.fields.RTC_TIME).toBe(input.fields.RTC_TIME);
  expect(result.fields.HITS).toBe(input.fields.HITS);
  expect(result.fields.FLAGS).toBe(input.fields.FLAGS);
  expect(result.fields.SPORT).toBe(input.fields.SPORT);
  expect(result.fields.DECODER_ID).toBe(input.fields.DECODER_ID);
});
