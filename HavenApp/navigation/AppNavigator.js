import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { HomeScreen, MeditationTimer } from '../screens/';

const AppNavigator = createStackNavigator(
  {
    Home: HomeScreen,
    MeditationTimer: MeditationTimer,
  },
  {
    initialRouteName: 'Home',
  }
);

export default AppNavigator;
