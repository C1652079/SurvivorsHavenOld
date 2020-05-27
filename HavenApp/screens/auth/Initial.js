import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { withFirebaseHOC } from '../../config/';

const Initial = (props) => {
  useEffect(() => {
    props.firebase.checkUserAuth((user) => {
      if (user) {
        props.navigation.navigate('App');
      } else {
        props.navigation.navigate('Auth');
      }
    });
  });

  return <View></View>;
};

export default withFirebaseHOC(Initial);
