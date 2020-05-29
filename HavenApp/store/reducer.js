import { ADD_AUDIO, REMOVE_AUDIO } from './actions';

const initialState = {
  audioItems: [],
};

const audioReducer = (state = initialState, action) => {
  const existingIndex = state.audioItems.findIndex(
    (audio) => audio.id === action.audioItemId
  );

  switch (action.type) {
    case ADD_AUDIO:
      if (existingIndex < 0) {
        return {
          ...state,
          audioItems: state.audioItems.concat(action.audioItem),
        };
      }

    case REMOVE_AUDIO:
      if (existingIndex >= 0) {
        const updatedList = [...state.audioItems].splice(existingIndex, 1);
        return { ...state, audioItems: updatedList };
      }
    default:
      return state;
  }

  return state;
};

export default audioReducer;
