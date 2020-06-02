import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import moment from 'moment';
import { AntDesign } from '@expo/vector-icons';

const AudioItem = (props) => {
  const recordDate = {
    sameDay: '[Today]',
    nextDay: '[Tomorrow]',
    nextWeek: 'dddd',
    lastDay: '[Yesterday]',
    lastWeek: '[Last] dddd',
    sameElse: 'MM/DD/YYYY',
  };

  return (
    <View style={styles.itemContainer}>
      <TouchableOpacity onPress={props.enablePlayback.bind(this, props.url)}>
        <Text style={styles.audioName}>{props.title}</Text>
        <Text style={styles.date}>
          {moment(props.date).calendar(null, recordDate)}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{ marginRight: 20 }}
        onPress={props.removeFile.bind(this, props.id)}
      >
        <AntDesign name="delete" size={22} color="red" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  audioName: {
    color: 'black',
    fontSize: 22,
  },
  date: {
    fontSize: 18,
    color: 'white',
  },
  itemContainer: {
    margin: 10,
    padding: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});

export default AudioItem;
