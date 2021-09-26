const parseHeader = require("./parseHeader");
const { getFieldsForType } = require("./");
const FieldReader = require("./FieldReader");

module.exports = function (rawBuffer) {
  var buffer = removeEscape(rawBuffer);
  const header = parseHeader(buffer);
  const fields = getFieldsForType(header.type);
  return { type: header.type, fields: readFields(fields, buffer, 10) };
};

/*
    Removes the escape characters from the buffer. 
    Basically anywhere a 0x8d is seen you need to remove it and add 0x20 to the next byte.
*/
function removeEscape(buffer) {
  const result = [];
  const esc = 0x8d;
  const offset = 0x20;
  let escSeen = false;
  for (let i = 0; i < buffer.length; i++) {
    if (escSeen) {
      result.push(buffer[i] - offset);
      escSeen = false;
      continue;
    }

    if (buffer[i] == esc) {
      escSeen = true;
      continue;
    }

    result.push(buffer[i]);
  }

  return Buffer.from(result);
}

function readFields(fieldDefinitions, buffer, offset) {
  let index = offset;
  const fields = {};

  const fieldReader = FieldReader(fieldDefinitions);

  while (true) {
    const readResult = fieldReader(buffer, index);

    if (!readResult) return fields;

    fields[readResult.name] = readResult.value;
    index += readResult.length;
  }
}
