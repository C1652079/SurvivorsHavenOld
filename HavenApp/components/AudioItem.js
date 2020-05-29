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
    <View style={styles.audioItem}>
      <View style={styles.infoContainer}>
        <TouchableOpacity onPress={props.enablePlayback.bind(this, props.url)}>
          <Text>{props.title}</Text>
          <Text style={styles.date}>
            {moment(props.date).calendar(null, recordDate)}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.deleteContainer}>
        <TouchableOpacity onPress={props.removeFile.bind(this, props.id)}>
          <AntDesign name="delete" size={24} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  audioItem: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  date: {
    color: '#505050',
  },
  infoContainer: {},
  deleteContainer: {},
});

export default AudioItem;
