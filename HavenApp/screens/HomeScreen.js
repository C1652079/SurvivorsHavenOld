import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Button } from 'react-native-elements';
import { withFirebaseHOC } from '../config/';

const HomeScreen = (props) => {
  const SignOutHandler = async () => {
    try {
      await props.firebase.signOut();
      props.navigation.navigate('Auth');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View>
      <Button
        title="Meditate"
        onPress={() => {
          props.navigation.navigate('MeditationTimer');
        }}
        titleStyle={{
          color: '#F57C00',
        }}
        type="clear"
      />
      <Button
        title="Choose Image"
        onPress={() => {
          props.navigation.navigate('ChooseImage');
        }}
        titleStyle={{
          color: '#F57C00',
        }}
        type="clear"
      />
      <Button
        title="Record Audio"
        onPress={() => {
          props.navigation.navigate('Record');
        }}
        titleStyle={{
          color: '#F57C00',
        }}
        type="clear"
      />
      <Button
        title="Draw Pad"
        onPress={() => {
          props.navigation.navigate('DrawPad');
        }}
        titleStyle={{
          color: '#F57C00',
        }}
        type="clear"
      />
      <Button
        title="Signout"
        onPress={SignOutHandler}
        titleStyle={{
          color: '#F57C00',
        }}
        type="clear"
      />
    </View>
  );
};

const styles = StyleSheet.create({});

export default withFirebaseHOC(HomeScreen);
