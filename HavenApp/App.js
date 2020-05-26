import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as Font from 'expo-font';
import Firebase, { FirebaseProvider } from './config/';
import AppContainer from './navigation';

export default function App() {
  return (
    <FirebaseProvider value={Firebase}>
      <AppContainer />
    </FirebaseProvider>
  );
}

const styles = StyleSheet.create({});
