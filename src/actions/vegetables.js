import Promise from 'bluebird';
import $ from 'jquery';
import NProgress from 'nprogress';
import { withProgress } from './progress';

export function __fetchVegetables() {
  const deferred = Promise.pending();
  $.ajax({
    url: '/api/v1/vegetables',
    success: (fruits) => { deferred.resolve(fruits); },
  });
  return deferred.promise;
}

export function fetchVegetables() {
  return withProgress(dispatch => ({
    type: 'FETCH_VEGETABLES',
    payload: {
      promise: __fetchVegetables(),
    }
  }));
}

//export fetchFruits; //{ withProgress(fetchFruits) as fetchFruits };
