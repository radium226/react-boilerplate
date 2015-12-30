import { createStore as createReduxStore, applyMiddleware, compose } from 'redux';
import DevTools from './containers/DevTools';
import createReducer from './reducer';
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';

const c = compose(DevTools.instrument())(createReduxStore)

const promise = promiseMiddleware();

const createStoreWithMiddleware = applyMiddleware(
  thunk,
  promise
)(c);

function createStore(initialState) {
  const reducer = createReducer();
  const store = createStoreWithMiddleware(reducer);
  return store;
}

export default createStore;
