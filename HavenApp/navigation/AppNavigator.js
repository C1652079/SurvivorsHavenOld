import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import {
  HomeScreen,
  MeditationTimer,
  RecordAudio,
  AudioLibrary,
  ChooseMoodImage,
  DrawPad
} from '../screens/';

const AppNavigator = createStackNavigator(
  {
    Home: HomeScreen,
    ChooseImage: ChooseMoodImage,
    MeditationTimer: MeditationTimer,
    RecordAudio: RecordAudio,
    AudioLibrary: AudioLibrary,
    DrawPad: DrawPad
  },
  {
    initialRouteName: 'Home',
  }
);

export default AppNavigator;
