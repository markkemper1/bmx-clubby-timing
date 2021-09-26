const { getFieldsForType } = require(".");
const FieldReader = require("./FieldReader");

const passingFields = getFieldsForType("PASSING");

// Body of the record
// 01:04:b2:9b:01:00:03:04:27:fc:70:00:04:08:e8:19:e6:bd:8a:75:04:00:05:02:33:00:
// 06:02:10:00:08:02:00:00:81:04:fc:05:04:00:8f

//

/* 
  END OF RECORD
*/
// 8f
const fieldReader = FieldReader(passingFields);
[
  {
    item: "01 04 b2:9b:01:00", //  01: - PASSING_NUMBER, 04: - length 4 bytes
    name: "PASSING_NUMBER",
    value: 105394,
    length: 4,
  },
  {
    item: "03 04 27:fc:70:00", //03: - TRANSPONDER,  04: - length 4 bytes
    name: "TRANSPONDER",
    value: 7404583,
    length: 4,
  },
  {
    item: "04 08 e8:19:e6:bd 8a:75:04:00", // 04: - RTC_TIME, 08: - length 8 bytes
    name: "RTC_TIME",
    value: 1255138658753,
    length: 8,
  },
  {
    item: "05 02 33:00", // 05: - STRENGTH, 02: - length 2 bytes
    name: "STRENGTH",
    value: 51,
    length: 2,
  },
  {
    item: "06 02 10:00", //06: - HITS, 02: - length 2 bytes
    name: "HITS",
    value: 16,
    length: 2,
  },
  {
    item: "08 02 00:00", // 08: - FLAGS,  02: - length 2 bytes
    name: "FLAGS",
    value: 0,
    length: 2,
  },
  {
    item: "81 04 fc:05:04:00", //81: - DECODER_ID, 04: - length 4 bytes
    name: "DECODER_ID",
    value: 263676,
    length: 4,
  },
].forEach(({ item, name, value, length }) => {
  test("Can read field " + name, () => {
    const buffer = Buffer.from(item.replace(/[:\s]/g, ""), "hex");
    console.log("Reading: ", buffer);
    const result = fieldReader(buffer, 0);
    console.log("Result: ", result);
    expect(result.length).toBe(length + 2);
    expect(result.value).toBe(value);
    expect(result.name).toBe(name);
  });
});

test("End of record returns null", () => {
  const buffer = Buffer.from("8f", "hex");
  const result = fieldReader(buffer, 0);
  expect(result).toBe(null);
});
