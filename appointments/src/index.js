import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Router, Route } from "react-router";
import { appHistory } from "./history";
import { configureStore } from "./store";
import { ConnectedApp } from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={configureStore()}>
    <Router history={appHistory}>
      <Route path="/" component={ConnectedApp} />
    </Router>
  </Provider>
);
