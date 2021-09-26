module.exports = function (fieldDefinitions) {
  return function (buffer, offset) {
    let index = offset;
    const type = buffer[index++];
    const field = fieldDefinitions[type];
    if (type == 0x8f) return null;
    const length = buffer.readInt8(index++);
    const newOffset = length + 2;

    if (!field) {
      index += length;
      console.warn("Field not defined", type, index, buffer.slice(index).toString("hex"));
      return { length: newOffset };
    }
    const name = field.name;
    switch (field.type) {
      case "time":
        return { name, length: newOffset, value: parseInt(readint(buffer, length, index) / BigInt(1000)) };
      case "int":
        return { name, length: newOffset, value: readint(buffer, length, index) };
      case "string":
        return { name, length: newOffset, value: buffer.slice(index, index + length).toString("ascii") };
      case "hex":
        return { name, length: newOffset, value: buffer.slice(index, index + length).toString("hex") };
    }
    return null;
  };

  function readint(buffer, length, index) {
    const intBuffer = buffer.slice(index, index + length).reverse();
    switch (length) {
      case 1:
        return intBuffer.readInt8();
      case 2:
        return intBuffer.readInt16BE();
      case 4:
        return intBuffer.readInt32BE();
      case 8:
        return intBuffer.readBigUInt64BE();
      default:
        throw new Error("Invalid length for int field", length);
    }
  }
};
