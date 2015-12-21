import React from 'react'; // TODO Let Gulp auto import this
import { Route, IndexRoute, Redirect } from 'react-router';

import RootContainer from './containers/Root';

import ChoicesPage from './pages/Choices';

import Fruits from './pages/Fruits';
import ListFruits from './pages/fruits/List';
import AddFruits from './pages/fruits/Add';

import VegetablesPage from './pages/Vegetables';

function createRoutes() {
  return (
    <Route path="/" component={ RootContainer }>
      <IndexRoute component={ ChoicesPage } />
      <Redirect from="/fruits" to="/fruits/list" />
      <Route path="/fruits" component={ Fruits }>
        <Route path="list" component={ ListFruits } />
        <Route path="add" component={ AddFruits } />
      </Route>
      <Route path="/vegetables" component={ VegetablesPage } />
    </Route>
  );
}

export default createRoutes;
