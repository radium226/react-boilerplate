const initialState = {
  vegetables: [],
};

function vegetables(state = initialState, action) {
  switch (action.type) {
    case 'FETCH_VEGETABLES_FULFILLED':
      return {
        ...state,
        vegetables: action.payload,
      };
    case 'FETCH_VEGETABLES_REJECTED':
      console.log(action);
      return {
        ...state,
        error: action.error
      };
    default:
      return state;
  }
}

export default vegetables;
