import React from "react";
import { Grid } from "@material-ui/core";

const defaultFieldSize = {
  _default: { xs: 12 },
  started: { sm: 6 },
  finished: { sm: 6 },
  description: { sm: 12 },
};

export function getComponentSize({ xs, sm, md, lg, xl }) {
  const override = {};
  if (xs) override.xs = xs;
  if (sm) override.sm = sm;
  if (md) override.md = md;
  if (lg) override.lg = lg;
  if (xl) override.xl = xl;

  const result = {
    ...defaultFieldSize._default,
    ...override,
  };
  return result;
}

export default function FieldBase({ item, xs, sm, md, lg, xl, children, render, ...extraProps }) {
  const Field = render({
    ...extraProps,
  });

  return (
    <Grid item {...getComponentSize({ xs, sm, md, lg, xl })}>
      {Field}
      {children}
    </Grid>
  );
}
