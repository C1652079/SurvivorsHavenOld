import { ADD_IMAGE } from './actions';

const initialState = {
  imageUri: '',
};

const imageReducer = (state = initialState, action) => {
  if (action.type === ADD_IMAGE) {
    return {
      imageUri: action.imageUri,
    };
  } else {
    return state;
  }
};

export default imageReducer;
