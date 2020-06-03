import React from 'react';
import { Text, View, AsyncStorage } from 'react-native';
import * as Font from 'expo-font';
import Firebase, { FirebaseProvider } from './config/';
import AppContainer from './navigation';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import audioReducer from './store/audioReducer';
import imageReducer from './store/imageReducer';
import { persistStore, persistReducer } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

const reducer = combineReducers({
  audios: audioReducer,
  images: imageReducer,
});

const persistedReducer = persistReducer(persistConfig, reducer);
const store = createStore(persistedReducer);
const persistor = persistStore(store);

export default function App() {
  return (
    <FirebaseProvider value={Firebase}>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <AppContainer />
        </PersistGate>
      </Provider>
    </FirebaseProvider>
  );
}
