import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import {
  HomeScreen,
  MeditationTimer,
  RecordAudio,
  AudioLibrary,
  ChooseMoodImage,
  DrawPad,
} from '../screens/';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const AudioTabNavigator = createBottomTabNavigator(
  {
    Record: {
      screen: RecordAudio,
      navigationOptions: {
        tabBarIcon: (tabInfo) => {
          return (
            <MaterialCommunityIcons
              name="record-rec"
              size={35}
              color={tabInfo.tintColor}
            />
          );
        },
      },
    },
    Library: {
      screen: AudioLibrary,
      navigationOptions: {
        tabBarIcon: (tabInfo) => {
          return (
            <MaterialCommunityIcons
              name="library-music"
              size={25}
              color={tabInfo.tintColor}
            />
          );
        },
      },
    },
  },
  {
    tabBarOptions: { activeTintColor: '' },
  }
);

const AppNavigator = createStackNavigator(
  {
    Home: HomeScreen,
    ChooseImage: ChooseMoodImage,
    MeditationTimer: MeditationTimer,
    RecordAudio: AudioTabNavigator,
    DrawPad: DrawPad,
  },
  {
    initialRouteName: 'Home',
  }
);

export default AppNavigator;
