export const ADD_AUDIO = 'ADD_AUDIO';
export const REMOVE_AUDIO = 'REMOVE_AUDIO';

export const addAudio = (audioItem) => {
  return { type: ADD_AUDIO, audioItem: audioItem, audioItemId: audioItem.id};
};

export const removeAudio = (audioItemId) => {
  return { type: REMOVE_AUDIO, audioItemId: audioItemId };
};
