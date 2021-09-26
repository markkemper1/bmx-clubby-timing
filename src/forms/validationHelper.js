import * as vals from "./validators";

export default function validationHelper({ required, validate }) {
  let items = [];
  if (required) items.push(vals.required);

  if (validate instanceof Function) {
    items.push(validate);
  }
  if (validate instanceof Array) {
    items = items.concat(validate);
  }

  if (validate instanceof Function) {
    return validate;
  }

  if (validate instanceof Object) {
    throw new Error("Object not support in validation Helper");
  }

  return (value, values) => items.reduce((error, v) => error || v(value, values), undefined);
}
