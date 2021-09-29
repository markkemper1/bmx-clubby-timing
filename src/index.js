import React from "react";
import ReactDOM from "react-dom";
import { App } from "./App";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";

const baseSentryOptions = {
  dsn: "https://bf7d4d09492643dfa1832204d3c18712@o1017083.ingest.sentry.io/5984500",
  integrations: [new Integrations.BrowserTracing()],
  tracesSampleRate: 1.0,
}

if (window.api) {
  window.api.on("sentry_init", (args) => {
    console.log(args)
    Sentry.init({
      ...args,
      ...baseSentryOptions
    });
    ReactDOM.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
      document.getElementById("root")
    );
  });

  window.api.on("sentry_set_context", (name, args) => {
    Sentry.setContext(name, args);
  });

  window.api.send("sentry_init");
}
else {
  Sentry.init(baseSentryOptions);
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById("root")
  );
}


