import { createStore as createReduxStore, compose } from 'redux';
import DevTools from './containers/DevTools';
import createReducer from './reducer';

function createStore(initialState) {
  const reducer = createReducer();
  const store = initialState ? compose(DevTools.instrument())(createReduxStore)(reducer, initialState) : compose(DevTools.instrument())(createReduxStore)(reducer);
  return store;
}

export default createStore;
