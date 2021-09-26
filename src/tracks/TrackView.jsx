import React from "react";
import { Grid, CircularProgress } from "@material-ui/core";
import { useGet } from "../hooks/useGet";
import { Link } from "react-router-dom";

const trackPath = "/api/tracks";

export const TrackView = () => {
  const request = useGet(trackPath);
  if (request.loading) return <CircularProgress />;
  const { name, gateTransponderCode, loops = [] } = request.result || {};
  return (
    <div style={{ padding: "20px" }}>
      <Grid container spacing={3}>
        <Grid item xs={3} style={{ textAlign: "right" }}>
          <strong>Name:</strong>
        </Grid>
        <Grid item xs={6}>
          {name}
        </Grid>
        <Grid item xs={3}>
          <Link to={"/track/edit"}>Change Track Settings</Link>
        </Grid>
        <Grid item xs={3} style={{ textAlign: "right" }}>
          <strong>Gate Transponder Code:</strong>
        </Grid>
        <Grid item xs={9}>
          {gateTransponderCode}
        </Grid>
      </Grid>
      {loops.map((loop, index) => (
        <Grid container key={`loop_${index}`} spacing={3}>
          <Grid item xs={3} style={{ textAlign: "right" }}>
            <strong>Loop #{index + 1}:</strong>
          </Grid>
          <Grid item xs={9}>
            {loop.name} ({loop.minTime / 1000}s - {loop.maxTime / 1000}s)
          </Grid>
        </Grid>
      ))}
    </div>
  );
};
