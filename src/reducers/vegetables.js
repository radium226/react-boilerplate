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
    default:
      return state;
  }
}

export default vegetables;
