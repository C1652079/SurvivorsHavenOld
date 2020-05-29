import React, { useState } from 'react';
import {
  Dimensions,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Slider,
  Alert,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons, Entypo, Octicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { AudioList } from '../../components';
import { durationToStr } from '../../utils/DateHelper';
import { removeAudio } from '../../store/actions';

const { width: DeviceWidth } = Dimensions.get('window');

const AudioLibrary = (props) => {
  const availableRecordings = useSelector((state) => state.audios.audioItems);

  const [isLoading, setIsLoading] = useState(false);
  const [sound, setSound] = useState(null);
  const [isSeeking, setIsSeeking] = useState(false);
  const [playAtEndSeek, setPlayAtEndSeek] = useState(false);
  const [isPlaybackAllowed, setIsPlaybackAllowed] = useState(false);
  const [shouldPlay, setShouldPlay] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [soundPosition, setSoundPosition] = useState(null);
  const [soundDuration, setSoundDuration] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1.0);
  const [rate, setRate] = useState(1.0);
  const [correctPitch, setCorrectPitch] = useState(false);

  const dispatch = useDispatch();

  const setAudioMode = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        playsInSilentModeIOS: true,
        playsInSilentLockedModeIOS: true,
        shouldDuckAndroid: true,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
        playThroughEarpieceAndroid: false,
        staysActiveInBackground: true,
      });
    } catch (error) {
      console.log(error); // eslint-disable-line
    }
  };

  const createAndLoadSound = async (fileURL) => {
    const { sound, status } = await Audio.Sound.createAsync(
      { uri: fileURL },
      {
        isLooping: true,
        isMuted: muted,
        volume: volume,
        rate: rate,
        shouldCorrectPitch: correctPitch,
      },
      updateScreen
    );

    sound.setProgressUpdateIntervalAsync(100);
    setSound(sound);
  };

  const updateScreen = (status) => {
    if (status.isLoaded) {
      setSoundDuration(status.durationMillis);
      setSoundPosition(status.positionMillis);
      setShouldPlay(status.shouldPlay);
      setIsPlaying(status.isPlaying);
      setMuted(status.isMuted);
      setVolume(status.volume);
      setCorrectPitch(status.shouldCorrectPitch);
      setIsPlaybackAllowed(true);
    } else {
      setSoundDuration(null);
      setSoundPosition(null);
      setIsPlaybackAllowed(false);
      if (status.error) {
        console.log(`Audio Player Error: ${status.error}`);
      }
    }
  };

  const disablePlayback = async () => {
    if (sound !== null) {
      await sound.unloadAsync();
      sound.setOnPlaybackStatusUpdate(null);
      setSound(null);
    }
  };

  const enablePlayback = async (fileURL) => {
    await stopPlayback();
    setIsLoading(true);
    await setAudioMode();
    await createAndLoadSound(fileURL);
    setIsLoading(false);
  };

  const playPlauseHandler = () => {
    if (sound != null) {
      if (isPlaying) {
        sound.pauseAsync();
      } else {
        sound.playAsync();
      }
    }
  };

  const stopPlayback = async () => {
    if (sound != null) {
      sound.stopAsync();
      await disablePlayback();
    }
  };

  const mutePlayback = () => {
    if (sound != null) {
      sound.setIsMutedAsync(!muted);
    }
  };

  const changeVolume = (value) => {
    if (sound != null) {
      sound.setVolumeAsync(value);
    }
  };

  const seekAudio = (value) => {
    if (sound != null && !isSeeking) {
      setIsSeeking(true);
      setPlayAtEndSeek(shouldPlay);
      sound.pauseAsync();
    }
  };

  const completeSeekHandler = async (value) => {
    if (sound != null) {
      setIsSeeking(false);
      const seekPosition = value * soundDuration;
      if (playAtEndSeek) {
        sound.playFromPositionAsync(seekPosition);
      } else {
        sound.setPositionAsync(seekPosition);
      }
    }
  };

  const getSeekPosition = () => {
    if (sound != null && soundPosition != null && soundDuration != null) {
      return soundPosition / soundDuration;
    }
    return 0;
  };

  const confirmationReceived = () => {
    setConfirmedDelete(true);
  };

  const removeAudioFromLibrary = (audioItemId) => {
    Alert.alert('Confirmation', 'Are you sure you want to delete this audio?', [
      {
        text: 'Confirm',
        style: 'destructive',
        onPress: () => {
          dispatch(removeAudio(audioItemId));
        },
      },
      { text: 'Cancel', style: 'destructive' },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.audioList}>
        <AudioList
          listData={availableRecordings}
          enablePlayback={enablePlayback}
          removeFile={removeAudioFromLibrary}
        />
      </View>
      <View
        style={[
          styles.playerContainer,
          {
            opacity: !isPlaybackAllowed || isLoading ? 0.5 : 1.0,
          },
        ]}
      >
        <View style={styles.playbackContainer}>
          <Slider
            style={styles.playbackSlider}
            value={getSeekPosition()}
            onValueChange={seekAudio}
            onSlidingComplete={completeSeekHandler}
            disabled={!isPlaybackAllowed || isLoading}
          />
          <Text style={styles.playbackTimestamp}>
            {durationToStr(soundPosition > soundDuration ? 0 : soundPosition)}
          </Text>
        </View>

        <View style={styles.buttonsContainer}>
          <View style={styles.playStopContainer}>
            <TouchableOpacity
              onPress={stopPlayback}
              disabled={!isPlaybackAllowed || isLoading}
            >
              <Entypo name="controller-stop" size={50} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={playPlauseHandler}
              disabled={!isPlaybackAllowed || isLoading}
            >
              {isPlaying ? (
                <Ionicons name="ios-pause" size={50} color="black" />
              ) : (
                <Ionicons name="ios-play" size={50} color="black" />
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.volumeContainer}>
            <TouchableOpacity
              onPress={mutePlayback}
              disabled={!isPlaybackAllowed || isLoading}
            >
              {muted ? (
                <Octicons name="mute" size={40} color="black" />
              ) : (
                <Octicons name="unmute" size={40} color="black" />
              )}
            </TouchableOpacity>
            <Slider
              style={styles.volumeSlider}
              value={1}
              onValueChange={changeVolume}
              disabled={!isPlaybackAllowed || isLoading}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  audioList: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
  playerContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  playbackContainer: {
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  playbackSlider: {
    width: DeviceWidth / 1.5,
  },
  playbackTimestamp: {
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  playStopContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  volumeContainer: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  volumeSlider: {
    width: DeviceWidth / 3.0,
  },
});

export default AudioLibrary;
