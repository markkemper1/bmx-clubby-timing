module.exports = function (fieldDefinitions) {
  return function (name, value) {
    const field = fieldDefinitions[name];
    const fieldType = field.type;
    let size = field.size;
    if (fieldType == "string") size = value.length;
    if (fieldType == "hex") size = value.length / 2;
    if (!size) throw new Error("Size not defined for " + fieldType + " - " + value);
    const buf = Buffer.alloc(2 + size);
    buf.writeUInt8(field.code, 0);
    buf.writeUInt8(size, 1);
    switch (fieldType) {
      case "time":
        buf.writeBigUInt64LE(BigInt(value) * BigInt(1000), 2);
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
  };
};

function writeInt(buffer, size, value) {
  switch (size) {
    case 1:
      return buffer.writeInt8(value, 2);
    case 2:
      return buffer.writeInt16LE(value, 2);
    case 4:
      return buffer.writeInt32LE(value, 2);
    case 8:
      return buffer.writeBigUInt64LE(value, 2);
    default:
      throw new Error("Invalid length for int field", length);
  }
}
