export const required = (value) => {
  return value ? undefined : "Required";
};

export const maxLength = (max) => (value) => value && value.length > max ? `Must be ${max} characters or less` : undefined;

export const minLength = (min) => (value) => value && value.length < min ? `Must be ${min} characters or more` : undefined;

export const number = (value) => (value && isNaN(Number(value)) ? "Must be a number" : undefined);

export const minValue = (min) => (value) => value && value < min ? `Must be at least ${min}` : undefined;

export const maxValue = (max) => (value) => value && value > max ? `Must be less than ${max}` : undefined;

export const email = (value) => (value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ? "Invalid email address" : undefined);

export const alphaNumeric = (value) => (value && /[^a-zA-Z0-9 ]/i.test(value) ? "Only alphanumeric characters" : undefined);
export const phoneNumber = (value) =>
  value && !/^(0|[1-9][0-9]{9})$/i.test(value) ? "Invalid phone number, must be 10 digits" : undefined;

export const composeValidators =
  (...validators) =>
  (value, values) =>
    validators.reduce((error, validator) => error || validator(value, values), undefined);

export default function validators(t) {
  return {
    required: (value) => (value !== "" && value !== undefined && value !== null ? undefined : t("validators:required")),

    maxLength: (max) => (value) => value && value.length > max ? t("validators:maxLength", { max }) : undefined,

    minLength: (min) => (value) => value && value.length < min ? t("validators:minLength", { min }) : undefined,

    number: (value) => (value && isNaN(Number(value)) ? t("validators:number") : undefined),

    minValue: (min) => (value) => value && value < min ? t("validators:minValue", { min }) : undefined,

    maxValue: (max) => (value) => value && value > max ? t("validators:maxValue", { max }) : undefined,

    email: (value) => (value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ? t("validators:email") : undefined),

    alphaNumeric: (value) => (value && /[^a-zA-Z0-9 ]/i.test(value) ? t("validators:alphaNumeric") : undefined),

    phoneNumber: (value) => (value && !/^(0|[1-9][0-9]{9})$/i.test(value) ? t("validators:phoneNumber") : undefined),

    compose:
      (...validators) =>
      (value) =>
        validators.reduce((error, validator) => error || validator(value), undefined),
  };
}
