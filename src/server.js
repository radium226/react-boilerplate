import express from 'express';
import createRoutes from './routes';
import createHistory, { HistoryStrategy } from './history';
import createStore from './store';
import { RoutingContext, match } from 'react-router';
import React from 'react';
import ReactDOM from 'react-dom/server';
import Html from './components/Html';
import { IntlProvider } from 'react-intl';
import messages from './messages.js';
import { Provider as StoreProvider } from 'react-redux';
import Renderer from './server/renderer';

const app = express();

const routes = createRoutes();
const history = createHistory(true);
const store = createStore();
const initialState = store.getState();

app.use(express.static('dist/public'));

const renderer = new Renderer({
  routes,
  clientHistoryStrategy: HistoryStrategy.BROWSER,
  store,
  initialState,
  messages,
});

app.get('/api/v1/fruits', (request, response) => {
  setTimeout(() => response.json(['Apple', 'Tomato']), 2000);
});

app.get('/api/v1/vegetables', (request, response) => {
  setTimeout(() => response.json(['Potato', 'BANANNANANAAA!!!']), 10000);
});

app.use((request, response, next) => {
  const path = request.path;
  console.log('Serving ' + request.path);
  renderer.render(path)
    .then(function(result) {
      if (result.redirect) {
        response.redirect(301, result.redirect.pathname + result.redirect.search);
      } else {
        response.send('<!DOCTYPE html>\n' + result.content);
      }
    });
});


  /*match({
    routes: routes, // eslint-disable-line object-shorthand
    location: location, // eslint-disable-line object-shorthand
  }, (err, redirectLocation, renderProps) => {
    if (redirectLocation) {
      console.log("Yay! ");
      response.redirect(301, redirectLocation.pathname + redirectLocation.search);
    } else if (err) {
      console.log("Yoy! ");
      next(err);
      // res.send(500, error.message);
    } else if (renderProps === null) {
      console.log("Yuy! ");
      response.status(404)
        .send('Not found');
    } else {
      console.log("Yyy! ");
      const data = {
        body: ReactDOM.renderToString(
          <IntlProvider locale="en" key="intl" messages={ messages }>
            <StoreProvider store={ store }>
              <RoutingContext { ...renderProps } />
            </StoreProvider>
          </IntlProvider>),
        initialState,
      };
      const html = ReactDOM.renderToStaticMarkup(<Html { ...data } />);
      console.log('html=' + html);
      response.send('<!DOCTYPE html>\n' + html);
    }
  });*/


const server = app.listen(3000, () => {
  const host = server.address().address;
  const port = server.address().port;

  console.log('Application started at http://%s:%s', host, port); // eslint-disable-line no-console
});
