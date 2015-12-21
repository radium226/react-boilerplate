import express from 'express';
import { RoutingContext, match } from 'react-router';
import React from 'react';
import ReactDOM from 'react-dom/server';
import Html from '../components/Html';
import { IntlProvider } from 'react-intl';
import { Provider as StoreProvider } from 'react-redux';
import Promise from 'bluebird';
import createHistory, { HistoryStrategy } from '../history.js';

class Renderer {

  constructor(options) {
    this.routes = options.routes;
    this.clientHistoryStrategy = options.clientHistoryStrategy;
    this.store = options.store;
    this.initialState = options.initialState;
    this.messages = options.messages;
  }

  render(path) {
    const deferred = Promise.pending();

    const { routes, store, initialState, messages, clientHistoryStrategy } = this;
    const serverHistoryStrategy = HistoryStrategy.MEMORY;
    const history = createHistory(serverHistoryStrategy);

    const location = history.createLocation(path);
    match({
      routes: routes, // eslint-disable-line object-shorthand
      location: location, // eslint-disable-line object-shorthand
    }, (err, redirectLocation, routingContextProps) => {
      if (redirectLocation) {
        console.log("Error! " + err);
      } else if (err) {
        deferred.reject(err);
      } else if (routingContextProps === null) {
        deferred.resolve({ redirect: redirectLocation });
      } else {
        const component = (
          <IntlProvider locale="en" key="intl" messages={ messages }>
            <StoreProvider store={ store }>
              <RoutingContext { ...routingContextProps } />
            </StoreProvider>
          </IntlProvider>
        );

        const htmlProps = {
          body: ReactDOM.renderToString(component),
          initialState,
          historyStrategy: clientHistoryStrategy,
        };
        const html = ReactDOM.renderToStaticMarkup(<Html { ...htmlProps } />);
        const content = '<!DOCTYPE html>\n' + html;
        deferred.resolve({ content });
      }
    });

    return deferred.promise;
  }

}

export default Renderer;
