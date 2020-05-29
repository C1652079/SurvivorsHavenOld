import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as Font from 'expo-font';
import Firebase, { FirebaseProvider } from './config/';
import AppContainer from './navigation';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import audioReducer from './store/reducer';

const reducer = combineReducers({
  audios: audioReducer,
});
const store = createStore(reducer);

export default function App() {
  return (
    <FirebaseProvider value={Firebase}>
      <Provider store={store}>
        <AppContainer />
      </Provider>
    </FirebaseProvider>
  );
}

const styles = StyleSheet.create({});
