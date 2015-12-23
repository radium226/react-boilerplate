import { combineReducers } from 'redux';
import fruits from './reducers/fruits';
import progress from './reducers/progress';
import vegetables from './reducers/vegetables';

function createReducer() {
  return combineReducers({
    fruits,
    progress,
    vegetables,
  });
}

export default createReducer;
