import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { HomeScreen, MeditationTimer, Monologues } from '../screens/';

const AppNavigator = createStackNavigator(
  {
    Home: HomeScreen,
    MeditationTimer: MeditationTimer,
    Monologues: Monologues
  },
  {
    initialRouteName: 'Home',
  }
);

export default AppNavigator;
