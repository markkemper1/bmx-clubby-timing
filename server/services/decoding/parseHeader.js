
const recordTypes = require('./recordTypes');

module.exports = function getHeader(buffer) {
    //00 - SOR (Start of Record = 8e)
    if (buffer[0] != 0x8e) throw new Error("Start of record indicator missing! buffer:" + buffer.toString('hex') + " [0]:" + buffer[0]);
    return {
        version: buffer.readInt8(1), //01 - Version (default = 02)
        length: buffer.readInt16LE(2), //02 - length of record LSB, 03 - length of record MSB
        crc: buffer.slice(4, 6).toString('hex'), //04 - CRC of record LSB, 05 - CRC of record MSB
        flags: buffer.slice(6, 8).toString('hex'), // 06 - Flags of record LSB,  07 - Flags of record MSB
        type: recordTypes[buffer.readInt16LE(8)] //08 - TOR (Type of Record) LSB, 09 - TOR(Type of Record) MSB
    }
}