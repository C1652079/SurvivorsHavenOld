import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';

import AudioItem from './AudioItem';

const AudioList = (props) => {
  const renderAudioItem = (itemData) => {
    return (
      <AudioItem
        id={itemData.item.id}
        title={itemData.item.title}
        date={itemData.item.recordDate}
        url={itemData.item.audioUrl}
        enablePlayback={props.enablePlayback}
        removeFile={props.removeFile}
      />
    );
  };

  return (
      <FlatList
        data={props.listData}
        keyExtractor={(item, index) => item.id}
        renderItem={renderAudioItem}
      />
  );
};

export default AudioList;
