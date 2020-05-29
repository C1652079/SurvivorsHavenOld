import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';

import AudioItem from './AudioItem';

const AudioList = (props) => {
  const renderAudioItem = (itemData) => {
    return (
      <AudioItem
        title={itemData.item.title}
        date={itemData.item.recordDate}
        url={itemData.item.audioUrl}
        enablePlayback={props.enablePlayback}
      />
    );
  };

  return (
    <View>
      <FlatList
        data={props.listData}
        keyExtractor={(item, index) => item.id}
        renderItem={renderAudioItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
});

export default AudioList;
