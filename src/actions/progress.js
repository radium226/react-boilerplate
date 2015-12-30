import NProgress from 'nprogress';

const PROMISE_TIMEOUT = 3000;

export function beginProgress() {
  return {
    type: 'BEGIN_PROGRESS'
  };
}

export function endProgress() {
  return {
    type: 'END_PROGRESS'
  };
}

export function withProgress(deferredAction) {
  return (dispatch) => {
    const action = deferredAction(dispatch);
    dispatch(beginProgress());
    dispatch({
      ...action,
      payload: {
        ...action.payload,
        promise: action.payload.promise
          .timeout(PROMISE_TIMEOUT)
          .finally(() => {
            dispatch(endProgress());
          })
          //.timeout(PROMISE_TIMEOUT)
      }
    });
  };
}
