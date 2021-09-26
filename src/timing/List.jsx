import React, { useEffect, useState } from "react";
import { Layout } from "../Layout";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import ClearIcon from "@material-ui/icons/Clear";
import moment from "moment";
import { TableBody, Table, TableHead, TableRow, TableCell, Paper, Divider, TextField, Link, InputAdornment } from "@material-ui/core";

const client = new W3CWebSocket(`ws://localhost:8999/ws`);

function format(time) {
  if (!time) return "-";
  return `${parseInt(time) / 1000}s`;
}
export const List = () => {
  const [times, setTimes] = useState([]);
  const [transponder, setTransponder] = useState("");
  const [gate, setGate] = useState("");

  function transponderFilterHandler(e) {
    setTransponder(e.target.value);
  }

  function mapTiming(raw) {
    return {
      id: raw.id,
      gate: raw.gate,
      transponder: raw.transponder,
      hillTime: raw.split1,
      split2: raw.split2,
      lapTime: raw.finish,
    };
  }

  useEffect(() => {
    client.onopen = () => {
      console.log("WebSocket Client Connected");
    };
    client.onmessage = (raw) => {
      const message = JSON.parse(raw.data);
      if (message.type === "timings") {
        setTimes(message.data.map(mapTiming));
      }
    };
  });
  return (
    <Layout title="Timing">
      <TextField
        label="Transponder"
        value={transponder}
        onChange={transponderFilterHandler}
        InputProps={{
          endAdornment: transponder ? (
            <InputAdornment position="end" onClick={(e) => setTransponder("")}>
              <ClearIcon fontSize="small" />
            </InputAdornment>
          ) : null,
        }}
      />
      &nbsp;
      <TextField
        label="Gate Time"
        value={gate && moment(gate).format("YY-MM-DD HH:mm:ss")}
        readOnly
        InputProps={{
          endAdornment: gate ? (
            <InputAdornment position="end" onClick={(e) => setGate("")}>
              <ClearIcon fontSize="small" />
            </InputAdornment>
          ) : null,
        }}
      />
      {/* {transponder ? <Chip label={transponder} onDelete={e => setTransponder("")} /> : null} */}
      <Divider variant="fullWidth" style={{ margin: "40px 0" }} />
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell variant="head">Gate</TableCell>
              <TableCell variant="head">Transponder</TableCell>
              <TableCell variant="head" align="right">
                Start Hill
              </TableCell>
              <TableCell variant="head" align="right">
                Lap Time {transponder}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {times
              .filter((x) => !transponder || x.transponder.startsWith(transponder))
              .filter((x) => !gate || x.gate === gate)
              .map((t) => (
                <TableRow key={t.id}>
                  <TableCell>
                    <Link
                      onClick={(e) => {
                        setGate(t.gate);
                        setTransponder("");
                      }}
                    >
                      {moment(t.gate).format("YY-MM-DD HH:mm:ss")}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link
                      onClick={(e) => {
                        setGate("");
                        setTransponder(t.transponder);
                      }}
                    >
                      {t.transponder}
                    </Link>
                  </TableCell>
                  <TableCell align="right">{format(t.hillTime)}</TableCell>
                  <TableCell align="right">{format(t.lapTime)}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Paper>
    </Layout>
  );
};
