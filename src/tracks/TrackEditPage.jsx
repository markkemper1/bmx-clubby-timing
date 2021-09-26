import React from "react";
import { Layout } from "../Layout";
import { Typography, Paper } from "@material-ui/core";
import { TrackEdit } from "./TrackEdit";

export const TrackEditPage = () => {
  return (
    <Layout>
      <Typography variant="h2">Track Settings</Typography>
      <Paper style={{ padding: "15px" }}>
        <TrackEdit />
      </Paper>
    </Layout>
  );
};
