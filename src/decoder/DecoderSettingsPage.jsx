import React from "react";
import { Layout } from "../Layout";
import { Typography, Paper } from "@material-ui/core";
import { DecoderSettingsEdit } from "./DecoderSettingsEdit";

export const DecoderSettingsPage = () => {
  return (
    <Layout>
      <Typography variant="h2">Decoder Settings</Typography>
      <Paper style={{ padding: "15px" }}>
        <DecoderSettingsEdit />
      </Paper>
    </Layout>
  );
};
