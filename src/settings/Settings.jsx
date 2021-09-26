import React from "react";
import { Layout } from "../Layout";
import { Typography, Paper, Divider } from "@material-ui/core";
import { DecoderStatus } from "../decoder";
import { TrackView } from "../tracks";
export default function Settings() {
  return (
    <Layout title={"Settings"}>
      <Typography variant="h4">Decoder Status</Typography>
      <Paper>
        <DecoderStatus />
      </Paper>
      <Divider variant="fullWidth" style={{ margin: "40px 0" }} />
      <Typography variant="h4">Track Settings</Typography>
      <Paper>
        <TrackView />
      </Paper>
    </Layout>
  );
}
