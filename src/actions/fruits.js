import Promise from 'bluebird';
import $ from 'jquery';
import NProgress from 'nprogress';
import { withProgress } from './progress';

export function __fetchFruits() {
  const deferred = Promise.pending();
  $.ajax({
    url: '/api/v1/fruits',
    success: (fruits) => { deferred.resolve(fruits); },
  });
  return deferred.promise;
}

export function fetchFruits() {
  return withProgress(dispatch => ({
    type: 'FETCH_FRUITS',
    payload: {
      promise: __fetchFruits(),
    }
  }));
}

//export fetchFruits; //{ withProgress(fetchFruits) as fetchFruits };
