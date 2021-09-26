const recordTypes = require("./recordTypes");
const { getFieldsForType, getFieldsByName } = require(".");
const FieldWriter = require("./FieldWriter");

module.exports = function ({ type, fields }) {
  //{ type: header.type, fields: readFields(fields, buffer, 10) }
  /*
fields: {
    PASSING_NUMBER: 15166,
    TRANSPONDER: 9992,
    RTC_TIME: 1625558581045000n,
    FLAGS: 0,
    SPORT: 41,
    DECODER_ID: 273134
  }*/

  const fieldTypes = getFieldsByName(type);
  const fieldsBuffer = writeFields(fields, fieldTypes);
  const header = writeHeader({ recordType: type, lenght: fieldsBuffer.length });
  return Buffer.concat([header, fieldsBuffer]);
};

function writeFields(fields, fieldTypes) {
  const fieldWriter = FieldWriter(fieldTypes);
  const result = [];
  for (const [key, value] of Object.entries(fields)) {
    result.push(fieldWriter(key, value));
  }
  result.push(Buffer.from("8f", "hex"));
  return Buffer.concat(result);
}

function writeField(fieldType, value, size) {
  if (fieldType == "string") size = value.length;
  if (fieldType == "hex") size = value.length / 2;
  if (!size) throw new Error("Size not defined for " + fieldType + " - " + value);
  const buf = Buffer.alloc(2 + size);
  buf.writeInt8(fieldType, 0);
  buf.writeInt8(size, 1);
  switch (fieldType) {
    case "time":
      buf.writeBigUInt64BE(BigInt(value) * BigInt(1000), 2);
      return buf;
    case "int":
      writeInt(buf, size, value);
      return buf;
    case "string":
      buf.fill(value, 2, 2 + size, "ascii");
      return buf;
    case "hex":
      buf.fill(value, 2, 2 + size, "hex");
      return buf;
    default:
      break;
    //throw new Error("Unknown field type", field)
  }
}
function writeInt(buffer, size, value) {
  switch (size) {
    case 1:
      return buffer.writeInt8(value, 2);
    case 2:
      return buffer.writeInt16BE(value, 2);
    case 4:
      return buffer.writeInt32BE(value, 2);
    case 8:
      return buffer.writeBigUInt64BE(value, 2);
    default:
      throw new Error("Invalid length for int field", length);
  }
}

function writeHeader({ lenght, recordType }) {
  const result = Buffer.alloc(10);
  result.fill(0x8e, 0); //00 - SOR (Start of Record = 8e)
  result.writeInt8(2, 1); //01 - Version (default = 02)
  result.writeUInt16LE(lenght, 2); //02 - length of record LSB, 03 - length of record MSB
  result.writeUInt16LE(0, 4); //04 - CRC of record LSB, 05 - CRC of record MSB
  result.writeUInt16LE(0, 6); // 06 - Flags of record LSB,  07 - Flags of record MSB
  const recordTypeCodeEntry = Object.entries(recordTypes).find(([key, value]) => value == recordType);
  if (!recordTypeCodeEntry) throw new Error(`Record type: ${recordType} could not be found in recordTypes`);
  result.writeInt16LE(recordTypeCodeEntry[0], 8); //08 - TOR (Type of Record) LSB, 09 - TOR(Type of Record) MSB
  return result;
}
