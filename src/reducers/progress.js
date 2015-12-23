const initialState = {
  progressing: 0,
};

function progress(state = initialState, action) {
  switch (action.type) {
    case 'BEGIN_PROGRESS':
      return {
        ...state,
        progressing: state.progressing +1,
      }
    case 'END_PROGRESS':
      return {
        ...state,
        progressing: state.progressing -1,
      }
    default:
      return state;
  }
}

export default progress;
