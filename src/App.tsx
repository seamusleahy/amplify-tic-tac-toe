import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Wrapper from "./components/Wrapper";
import "./App.css";

import GamePage, { GAME_ID_MIN_LENGTH } from "./pages/game";
import HomePage from "./pages/home";

const App: React.FunctionComponent = () => (
  <Wrapper>
    <Router>
      <Switch>
        <Route
          path={`/:gameId(\\w{${GAME_ID_MIN_LENGTH},})`}
          component={GamePage}
        />
        <Route path="/" component={HomePage} />
      </Switch>
    </Router>
  </Wrapper>
);

export default App;
