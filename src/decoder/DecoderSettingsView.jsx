import React from "react";
import { Grid, CircularProgress } from "@material-ui/core";
import { useGet } from "../hooks/useGet";
import { Link } from "react-router-dom";

const decoderSettingsPath = "/api/decoder/settings";

export const DecoderSettingsView = () => {
  const request = useGet(decoderSettingsPath);
  if (request.loading) return <CircularProgress />;
  const { ip, port } = request.result || {};
  return (
    <div style={{ padding: "20px" }}>
      <Grid container spacing={3}>
        <Grid item xs={1} style={{ textAlign: "right" }}>
          <strong>IP:</strong>
        </Grid>
        <Grid item xs={8}>
          {ip}
        </Grid>
        <Grid item xs={3}>
          <Link to={"/decoder/settings"}>Change Decoder Settings</Link>
        </Grid>
        <Grid item xs={1} style={{ textAlign: "right" }}>
          <strong>Port:</strong>
        </Grid>
        <Grid item xs={11}>
          {port}
        </Grid>
      </Grid>
    </div>
  );
};
