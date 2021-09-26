import React, { useState } from "react";
import { Grid, CircularProgress, Chip } from "@material-ui/core";
import { Link } from "react-router-dom";
import { Button } from "@material-ui/core";
import { usePut, useGet } from "../hooks";

const decoderSettingsPath = "/api/decoder/status";

export const DecoderStatus = () => {
  const request = useGet(decoderSettingsPath);
  const [status, setStatus] = useState();

  const connectRequest = usePut(decoderSettingsPath);

  async function onConnectClickHandler() {
    const statusResult = await connectRequest({ isConnected: true });
    setStatus(statusResult);
  }

  if (request.loading) return <CircularProgress />;
  const { settings, isConnected, error } = status || request.result || {};
  return (
    <div style={{ padding: "20px" }}>
      <Grid container spacing={3}>
        <Grid item xs={2} style={{ textAlign: "right" }}>
          <strong>Status:</strong>
        </Grid>
        <Grid item xs={8}>
          <Chip size="small" variant="default" label={isConnected ? "Connected" : "Not Connected"}></Chip>
          {!isConnected && (
            <>
              &nbsp;
              <Button size="small" variant="contained" color="primary" onClick={onConnectClickHandler}>
                Connect
              </Button>
            </>
          )}
          <p style={{ color: "red" }}>{JSON.stringify(error)}</p>
        </Grid>

        <Grid item xs={2}>
          <Link to={"/decoder/settings"}>Change Decoder Settings</Link>
        </Grid>
      </Grid>
      {settings && (
        <Grid container spacing={3}>
          <Grid item xs={2} style={{ textAlign: "right" }}>
            <strong>IP:</strong>
          </Grid>
          <Grid item xs={10}>
            {settings.ip}
          </Grid>
          <Grid item xs={2} style={{ textAlign: "right" }}>
            <strong>Port:</strong>
          </Grid>
          <Grid item xs={10}>
            {settings.port}
          </Grid>
        </Grid>
      )}
    </div>
  );
};
