import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Login from './Login';
import Home from './Home';
import CreateTeam from './CreateTeam';
import Register from './Register';

export default () => (
  <Router>
    <Switch>
      <Route path="/" exact component={Login} />
      <Route path="/register" exact component={Register} /> 
      <Route path="/home/:teamId?/:channelId?" exact component={Home} />
      <Route path="/create-team" exact component={CreateTeam} />
    </Switch>
  </Router>
);