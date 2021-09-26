const { getFieldsForType, getFieldsByName } = require(".");
const FieldWriter = require("./FieldWriter");

const passingFields = getFieldsByName("PASSING");
const fieldWriter = FieldWriter(passingFields);
[
  {
    expected: "01 04 b2:9b:01:00", //  01: - PASSING_NUMBER, 04: - length 4 bytes
    field: {
      name: "PASSING_NUMBER",
      value: 105394,
    },
  },
  {
    expected: "03 04 27:fc:70:00", //  //03: - TRANSPONDER,  04: - length 4 bytes
    field: {
      name: "TRANSPONDER",
      value: 7404583,
    },
  },
  {
    expected: "04 08 e8:19:e6:bd 8a:75:04:00", // 04: - RTC_TIME, 08: - length 8 bytes
    field: {
      name: "RTC_TIME",
      value: 1255138658753,
    },
  },
  {
    expected: "05 02 33:00", // 05: - STRENGTH, 02: - length 2 bytes
    field: {
      name: "STRENGTH",
      value: 51,
    },
  },
  {
    expected: "06 02 10:00", //06: - HITS, 02: - length 2 bytes
    field: {
      name: "HITS",
      value: 16,
    },
  },
  {
    expected: "08 02 00:00", // 08: - FLAGS,  02: - length 2 bytes
    field: {
      name: "FLAGS",
      value: 0,
    },
  },
  {
    expected: "81 04 fc:05:04:00", //81: - DECODER_ID, 04: - length 4 bytes
    field: {
      name: "DECODER_ID",
      value: 263676,
    },
  },
].forEach(({ field, expected }) => {
  test("Can write field " + field.name, () => {
    const result = fieldWriter(field.name, field.value);
    console.log(result.toString("hex"));
    expect(result.toString("hex")).toBe(expected.replace(/[ :]/g, ""));
  });
});
