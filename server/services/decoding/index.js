const fields = {
  PASSING: require("./fieldsPassing"),
  STATUS: require("./fieldsStatus"),
  GENERAL: require("./fieldsGeneral"),
};
exports.recordTypes = require("./recordTypes");

exports.getFieldsForType = function (type) {
  const list = fields[type].concat(fields.GENERAL);
  const result = {};
  list.forEach((x) => {
    result[x.code] = x;
  });
  return result;
};

exports.getFieldsByName = function (type) {
  const list = fields[type].concat(fields.GENERAL);
  const result = {};
  list.forEach((x) => {
    result[x.name] = x;
  });
  return result;
};

exports.parse = require("./parse");
