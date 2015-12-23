import NProgress from 'nprogress';

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
          .then(result => {
            dispatch(endProgress());
            return result;
          }),
      }
    });
  };
}
