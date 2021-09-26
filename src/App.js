import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { orange, green } from "@material-ui/core/colors";
import Main from "./pages/Main";
import Settings from "./settings/Settings";
import Timing from "./timing";
import { DecoderSettingsPage } from "./decoder";
import { TrackEditPage } from "./tracks";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

const theme = createMuiTheme({
  palette: {
    primary: orange,
    secondary: green,
  },
});

export const App = (props) => (
  <ThemeProvider theme={theme}>
    <Router>
      <Switch>
        <Route path="/timings">
          <Timing />
        </Route>
        <Route path="/settings">
          <Settings />
        </Route>
        <Route path="/decoder/settings">
          <DecoderSettingsPage />
        </Route>
        <Route path="/track/edit">
          <TrackEditPage />
        </Route>
        <Route path="*" exact={true}>
          <Main />
        </Route>
      </Switch>
    </Router>
  </ThemeProvider>
);
