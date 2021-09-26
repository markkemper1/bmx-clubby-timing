import React from "react";
import { Layout } from "../Layout";
import { Typography, Divider, Link } from "@material-ui/core";

export default function Main() {
  return (
    <Layout>
      <Typography variant="h2">Welcome</Typography>
      <Divider variant="fullWidth" style={{ margin: "40px 0" }} />

      {/* {transponder ? <Chip label={transponder} onDelete={e => setTransponder("")} /> : null} */}

      <Link href="/timings" variant="h3" color="primary">
        Timings
      </Link>
      <Divider variant="fullWidth" style={{ margin: "40px 0" }} />
      <Link href="/settings" variant="h3" color="primary">
        Settings
      </Link>
      <Divider variant="fullWidth" style={{ margin: "40px 0" }} />
    </Layout>
  );
}
