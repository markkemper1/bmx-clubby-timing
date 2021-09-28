import React from "react";
import { Button, CircularProgress, Typography, Grid } from "@material-ui/core";
import { useGet, usePost } from "../hooks";
import { Form } from "react-final-form";
import { useHistory } from "react-router-dom";
import { FORM_ERROR } from "final-form";
import arrayMutators from "final-form-arrays";
import { FieldArray } from "react-final-form-arrays";

import { TextField } from "../forms";
import FormState from "../forms/FormState";

const apiPath = "/api/tracks";

export function TrackEdit() {
  const request = useGet(apiPath);
  const post = usePost(apiPath);
  const history = useHistory();
  function onSubmit(values) {
    return post(values)
      .then((r) => {
        history.push("/settings");
        return r;
      })
      .catch((e) => {
        if (e.status !== 400) throw e;
        return { [FORM_ERROR]: e.data.errors };
      });
  }

  if (request.loading) return <CircularProgress />;
  const track = request.result;
  track.loops = track.loops || [];
  for (let i = 0; i < 2; i++) {
    if (track.loops[i]) continue;
    track.loops[i] = {
      name: i === 0 ? "Hill" : "Finish",
      minTime: i === 0 ? "1800" : "25000",
      maxTime: i === 0 ? "3000" : "80000",
    };
  }
  return (
    <Form
      initialValues={track}
      mutators={{
        // potentially other mutators could be merged here
        ...arrayMutators,
      }}
      onSubmit={onSubmit}
      render={({ handleSubmit, submitError }) => (
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <TextField label="Name" name="name" required />
            <TextField label="Gate Transponder Code" name="gateTransponderCode" required xs={12} />
            <Grid xs={12} item>
              <Typography variant="h6">Loops</Typography>
            </Grid>
            <FieldArray name="loops">
              {({ fields }) =>
                fields.map((name, index) => (
                  <>
                    <TextField label="Name" name={`${name}.name`} required xs={4} />
                    <TextField label="Min Time (ms)" name={`${name}.minTime`} required xs={4} />
                    <TextField label="Max Time (ms)" name={`${name}.maxTime`} required xs={4} />
                  </>
                ))
              }
            </FieldArray>

            <Grid item>
              <Button variant="contained" color="primary" type="submit">
                Save
              </Button>
            </Grid>
            {submitError && submitError.length > 0 && (
              <div className="error">
                {submitError.map((x) => (
                  <p>{x}</p>
                ))}
              </div>
            )}
            <FormState />
          </Grid>
        </form>
      )}
    />
  );
}
