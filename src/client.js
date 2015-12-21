import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import createRoutes from './routes';
import createHistory from './history';
import createStore from './store';
import { Router } from 'react-router';
import { Provider as StoreProvider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import messages from './messages.js';

$(document).ready(() => {
  const element = $('#client').get(0);

  const initialState = window.__INITIAL_STATE__;
  const historyStrategy = window.__HISTORY_TYPE__;

  const routes = createRoutes();
  const history = createHistory(historyStrategy);
  const store = createStore(initialState);

  const router = (
    <IntlProvider locale="en" key="intl" messages={ messages }>
      <StoreProvider store={ store }>
          <Router history={ history }>
            { routes }
          </Router>
      </StoreProvider>
    </IntlProvider>
  );

  ReactDOM.render(router, element);
});
