import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { AppLoading } from 'expo';
import * as Icon from '@expo/vector-icons';
import { withFirebaseHOC } from '../../config/';

const Initial = (props) => {
  const [isAssetsLoadingComplete, setIsAssetsLoadingComplete] = useState(false);

  useEffect(() => {
    try {
      props.firebase.checkUserAuth((user) => {
        if (user) {
          props.navigation.navigate('App');
        } else {
          props.navigation.navigate('Auth');
        }
      });
    } catch (error) {
      console.log(error);
    }
  });

  return <View></View>;
};

export default withFirebaseHOC(Initial);
