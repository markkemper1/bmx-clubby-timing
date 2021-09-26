import React from "react";
import BaseField from "./FieldBase";
import { TextField as TextFieldMUI } from "@material-ui/core";
import { Field } from "react-final-form";
import validationHelper from "./validationHelper";

export const TextFieldBase = (props) => {
  return <BaseField {...props} render={({ ...baseProvided }) => <TextFieldMUI {...baseProvided} />} />;
};

export const TextField = ({ required, validate, i18nKey, ...props }) => {
  const name = props.name;

  const validateFn = validationHelper({ required, validate });

  if (!name) throw new Error("name (or accessor) must be supplied to TextField. Props: " + JSON.stringify({ ...props }));

  return (
    <Field name={name} validate={validateFn}>
      {({ input, meta }) => {
        return <TextFieldBase name={name} {...input} {...meta} {...props} />;
      }}
    </Field>
  );
};
