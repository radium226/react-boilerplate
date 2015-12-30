const initialState = {
  isFetching: false,
  fruits: [],
};

function fruits(state = initialState, action) {
    switch (action.type) {
    case 'FETCH_FRUITS_PENDING':
      return {
        ...state,
        isFetching: true
      };
    case 'FETCH_FRUITS_FULFILLED':
      return {
        ...state,
        isFetching: false,
        fruits: action.payload,
      };
    default:
      return state;
  }
}

export default fruits;
