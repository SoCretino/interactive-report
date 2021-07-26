import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import Team from './Team';
import Work from './Work';
import Projects from './Projects';

import './Tabs.scss';

class Tabs extends Component {
  render() {
    return (
      <Switch>
        <div className = "Tabs">
          <Route exact path="/" component={Team}/>
          <Route path="/Team" component={props => <Team {...props}/>}/>
          <Route path="/Work" component={props => <Work {...props}/>}/>
          <Route path="/Projects" component={props => <Projects {...props}/>}/>
        </div>
      </Switch>
    );
  }
}

export default Tabs;