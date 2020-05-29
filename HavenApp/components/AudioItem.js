import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const AudioItem = (props) => {
  return (
    <View style={styles.audioItem}>
      <TouchableOpacity onPress={props.enablePlayback.bind(this, props.url)}>
        <Text>{props.title}</Text>
        <Text>{props.date}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  audioItem: {},
});

export default AudioItem;
