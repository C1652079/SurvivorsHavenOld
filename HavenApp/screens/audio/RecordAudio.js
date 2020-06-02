import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Button } from 'react-native-elements';
import { useDispatch } from 'react-redux';
import { Audio } from 'expo-av';
import moment from 'moment';
import { durationToStr } from '../../utils/DateHelper';
import { Ionicons } from '@expo/vector-icons';
import { addAudio } from '../../store/actions';

const RecordAudio = (props) => {
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [durationMillis, setDurationMillis] = useState(0);
  const [isDoneRecording, setIsDoneRecording] = useState(false);
  const [fileURL, setFileURL] = useState(null);
  const [audioName, setAudioName] = useState('');
  const [havePermission, setHavePermission] = useState(false);

  const dispatch = useDispatch();

  const setAudioMode = async (allowsRecordingIOS) => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: allowsRecordingIOS,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      });
    } catch (error) {
      console.log(error); // eslint-disable-line
    }
  };

  const recordingStatusUpdateHandler = (status) => {
    setDurationMillis(status.durationMillis);
    setIsRecording(status.isRecording);
    setIsDoneRecording(status.isDoneRecording);
  };

  const getPermission = async () => {
    let permissionResult = await Audio.requestPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert(
        'Access Denied!',
        'Permission to access microphone is required!',
        [{ text: 'Okay', style: 'destructive' }]
      );
      return;
    }

    setHavePermission(true);
  };

  const startRecording = async () => {
    getPermission();
    if (!havePermission) return;

    try {
      if (recording) {
        recording.setOnRecordingStatusUpdate(null);
        setRecording(null);
      }

      await setAudioMode(true);
      const newRecording = new Audio.Recording();
      newRecording.setOnRecordingStatusUpdate(recordingStatusUpdateHandler);
      newRecording.setProgressUpdateInterval(200);

      setFileURL(null);

      await newRecording.prepareToRecordAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      await newRecording.startAsync();
      setRecording(newRecording);
    } catch (error) {
      console.log(error); // eslint-disable-line
    }
  };

  const endRecording = async () => {
    try {
      await recording.stopAndUnloadAsync();
      await setAudioMode(false);
    } catch (error) {
      console.log(error); // eslint-disable-line
    }

    if (recording) {
      const fileUrl = recording.getURI();
      recording.setOnRecordingStatusUpdate(null);
      setRecording(null);
      setFileURL(fileUrl);
    }
  };

  const onCancelRecording = async () => {
    if (!recording) return;
    try {
      await recording.stopAndUnloadAsync();
    } catch (error) {
      // do nothing
    }
    recording.setOnRecordingStatusUpdate(null);
    setRecording(null);
  };

  const onSubmit = () => {
    if (audioName && fileURL) {
      const audioItem = {
        id: audioName,
        recordDate: moment().format(),
        title: audioName,
        audioUrl: fileURL,
        duration: durationMillis,
      };

      addAudioToLibrary(audioItem);
      setAudioName('');
      setIsDoneRecording(false);
      props.navigation.navigate('AudioLibrary');
    }
  };

  const addAudioToLibrary = (audioItem) => {
    dispatch(addAudio(audioItem));
  };

  const onCancelSave = () => {
    setAudioName('');
    setIsDoneRecording(false);
    setFileURL(null);
  };

  const onRecordPressed = () => {
    if (isRecording) {
      endRecording();
    } else {
      startRecording();
    }
  };

  if (isDoneRecording) { //TODO
    return (
      <View>
        <TouchableOpacity onPress={onCancelSave}>
          <Text>cross</Text>
        </TouchableOpacity>

        <TextInput
          placeholder="Give a name for your audio"
          value={audioName}
          onChangeText={setAudioName}
          autoCorrect={false}
          onSubmitEditing={onSubmit}
          returnKeyType="done"
          autoFocus
        />

        <Button title="Continue" onPress={onSubmit} disabled={!audioName} />
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <View style={styles.recordingContainer}>
          <TouchableOpacity onPress={onRecordPressed}>
            {isRecording ? (
              <Ionicons name="ios-mic" size={80} color="red" />
            ) : (
              <Ionicons name="ios-mic" size={80} color="black" />
            )}
          </TouchableOpacity>
          <Text style={styles.recordingTimestamp}>
            {durationToStr(durationMillis)}
          </Text>
        </View>

        <Button
          title="Library"
          onPress={() => {
            props.navigation.navigate('AudioLibrary');
          }}
          titleStyle={{
            color: '#F57C00',
          }}
          type="clear"
        />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  recordingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingTimestamp: {
    fontSize: 34,
    paddingLeft: 20,
  },
});

export default RecordAudio;
