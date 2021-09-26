import React from "react";
import { Button, CircularProgress, Grid } from "@material-ui/core";
import { useGet, usePost } from "../hooks";
import { Form } from "react-final-form";
import { useHistory } from "react-router-dom";
import { FORM_ERROR } from "final-form";
import { TextField } from "../forms";
import FormState from "../forms/FormState";

const decoderSettingsPath = "/api/decoder/settings";

export function DecoderSettingsEdit() {
  const request = useGet(decoderSettingsPath);
  const post = usePost(decoderSettingsPath);
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
  const decoder = request.result;
  return (
    <Form
      initialValues={decoder}
      onSubmit={onSubmit}
      render={({ handleSubmit, submitError }) => (
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <TextField label="IP" name="ip" required />
            <TextField label="Port" name="port" required />
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
