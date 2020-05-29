import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import {
  HomeScreen,
  MeditationTimer,
  RecordAudio,
  AudioLibrary,
} from '../screens/';

const AppNavigator = createStackNavigator(
  {
    Home: HomeScreen,
    MeditationTimer: MeditationTimer,
    RecordAudio: RecordAudio,
    AudioLibrary: AudioLibrary,
  },
  {
    initialRouteName: 'Home',
  }
);

export default AppNavigator;
