import React, { Component } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthenticationProvider, oidcLog } from "@axa-fr/react-oidc-context";

import oidcConfiguration from "./oidc_configuration";
import MainView from "./views/MainView";
import ProcessLoginView from "./views/ProcessLoginView";
import "./App.scss";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router>
          <AuthenticationProvider
            configuration={oidcConfiguration}
            loggerLevel={oidcLog.DEBUG}
            isEnabled
            callbackComponentOverride={ProcessLoginView}
          >
            <MainView />
          </AuthenticationProvider>
        </Router>
      </div>
    );
  }
}

export default App;
