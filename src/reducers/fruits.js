const initialState = [];

function fruits(state = initialState, action) {
  switch (action.type) {
    case 'ADD_FRUIT':
      return [...state, action.fruit];
    default:
      return state;
  }
}

export default fruits;
