import { combineReducers } from 'redux';
import fruits from './reducers/fruits';

function createReducer() {
  return combineReducers({
    fruits,
  });
}

export default createReducer;
