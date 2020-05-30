import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import {
  HomeScreen,
  MeditationTimer,
  RecordAudio,
  AudioLibrary,
  ChooseMoodImage
} from '../screens/';

const AppNavigator = createStackNavigator(
  {
    Home: HomeScreen,
    ChooseImage: ChooseMoodImage,
    MeditationTimer: MeditationTimer,
    RecordAudio: RecordAudio,
    AudioLibrary: AudioLibrary,
  },
  {
    initialRouteName: 'Home',
  }
);

export default AppNavigator;
