import React from 'react';
import {
  Dimensions,
  Image,
  Slider,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import * as Permissions from 'expo-permissions';
import { Ionicons, Entypo, Octicons } from '@expo/vector-icons';

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window');
const DISABLED_OPACITY = 0.5;

export default class Monologues extends React.Component {
  constructor(props) {
    super(props);
    this.recording = null;
    this.sound = null;
    this.isSeeking = false;
    this.shouldPlayAtEndOfSeek = false;
    this.state = {
      haveRecordingPermissions: false,
      isLoading: false,
      isPlaybackAllowed: false,
      muted: false,
      soundPosition: null,
      soundDuration: null,
      recordingDuration: null,
      shouldPlay: false,
      isPlaying: false,
      isRecording: false,
      fontLoaded: false,
      shouldCorrectPitch: true,
      volume: 1.0,
      rate: 1.0,
    };
    this.recordingSettings = JSON.parse(
      JSON.stringify(Audio.RECORDING_OPTIONS_PRESET_LOW_QUALITY)
    );
  }

  componentDidMount() {
    this._askForPermissions();
  }

  _askForPermissions = async () => {
    let permissionResult = await Audio.requestPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert(
        'Access Denied!',
        'Permission to access microphone is required!',
        [{ text: 'Okay', style: 'destructive' }]
      );
      return;
    }

    this.setState({
      haveRecordingPermissions: true,
    });
  };

  _updateScreenForSoundStatus = (status) => {
    if (status.isLoaded) {
      this.setState({
        soundDuration: status.durationMillis,
        soundPosition: status.positionMillis,
        shouldPlay: status.shouldPlay,
        isPlaying: status.isPlaying,
        rate: status.rate,
        muted: status.isMuted,
        volume: status.volume,
        shouldCorrectPitch: status.shouldCorrectPitch,
        isPlaybackAllowed: true,
      });
    } else {
      this.setState({
        soundDuration: null,
        soundPosition: null,
        isPlaybackAllowed: false,
      });
      if (status.error) {
        console.log(`FATAL PLAYER ERROR: ${status.error}`);
      }
    }
  };

  _updateScreenForRecordingStatus = (status) => {
    if (status.canRecord) {
      this.setState({
        isRecording: status.isRecording,
        recordingDuration: status.durationMillis,
      });
    } else if (status.isDoneRecording) {
      this.setState({
        isRecording: false,
        recordingDuration: status.durationMillis,
      });
      if (!this.state.isLoading) {
        this._stopRecordingAndEnablePlayback();
      }
    }
  };

  async _stopPlaybackAndBeginRecording() {
    this._askForPermissions();

    this.setState({
      isLoading: true,
    });
    if (this.sound !== null) {
      await this.sound.unloadAsync();
      this.sound.setOnPlaybackStatusUpdate(null);
      this.sound = null;
    }
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: false,
      staysActiveInBackground: true,
    });
    if (this.recording !== null) {
      this.recording.setOnRecordingStatusUpdate(null);
      this.recording = null;
    }

    const recording = new Audio.Recording();
    await recording.prepareToRecordAsync(this.recordingSettings);
    recording.setOnRecordingStatusUpdate(this._updateScreenForRecordingStatus);

    this.recording = recording;
    await this.recording.startAsync();
    this.setState({
      isLoading: false,
    });
  }

  async _stopRecordingAndEnablePlayback() {
    this.setState({
      isLoading: true,
    });
    try {
      await this.recording.stopAndUnloadAsync();
    } catch (error) {
      // Do nothing -- we are already unloaded.
    }
    const info = await FileSystem.getInfoAsync(this.recording.getURI());
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
    const { sound, status } = await this.recording.createNewLoadedSoundAsync(
      {
        isLooping: true,
        isMuted: this.state.muted,
        volume: this.state.volume,
        rate: this.state.rate,
        shouldCorrectPitch: this.state.shouldCorrectPitch,
      },
      this._updateScreenForSoundStatus
    );
    this.sound = sound;
    this.setState({
      isLoading: false,
    });
  }

  _onRecordPressed = () => {
    if (this.state.isRecording) {
      this._stopRecordingAndEnablePlayback();
    } else {
      this._stopPlaybackAndBeginRecording();
    }
  };

  _onPlayPausePressed = () => {
    if (this.sound != null) {
      if (this.state.isPlaying) {
        this.sound.pauseAsync();
      } else {
        this.sound.playAsync();
      }
    }
  };

  _onStopPressed = () => {
    if (this.sound != null) {
      this.sound.stopAsync();
    }
  };

  _onMutePressed = () => {
    if (this.sound != null) {
      this.sound.setIsMutedAsync(!this.state.muted);
    }
  };

  _onVolumeSliderValueChange = (value) => {
    if (this.sound != null) {
      this.sound.setVolumeAsync(value);
    }
  };

  _onSeekSliderValueChange = (value) => {
    if (this.sound != null && !this.isSeeking) {
      this.isSeeking = true;
      this.shouldPlayAtEndOfSeek = this.state.shouldPlay;
      this.sound.pauseAsync();
    }
  };

  _onSeekSliderSlidingComplete = async (value) => {
    if (this.sound != null) {
      this.isSeeking = false;
      const seekPosition = value * this.state.soundDuration;
      if (this.shouldPlayAtEndOfSeek) {
        this.sound.playFromPositionAsync(seekPosition);
      } else {
        this.sound.setPositionAsync(seekPosition);
      }
    }
  };

  _getSeekSliderPosition() {
    if (
      this.sound != null &&
      this.state.soundPosition != null &&
      this.state.soundDuration != null
    ) {
      return this.state.soundPosition / this.state.soundDuration;
    }
    return 0;
  }

  _getMMSSFromMillis(millis) {
    const totalSeconds = millis / 1000;
    const seconds = Math.floor(totalSeconds % 60);
    const minutes = Math.floor(totalSeconds / 60);

    const padWithZero = (number) => {
      const string = number.toString();
      if (number < 10) {
        return '0' + string;
      }
      return string;
    };
    return padWithZero(minutes) + ':' + padWithZero(seconds);
  }

  _getPlaybackTimestamp() {
    if (
      this.sound != null &&
      this.state.soundPosition != null &&
      this.state.soundDuration != null
    ) {
      return `${this._getMMSSFromMillis(
        this.state.soundPosition
      )} / ${this._getMMSSFromMillis(this.state.soundDuration)}`;
    }
    return '';
  }

  _getRecordingTimestamp() {
    if (this.state.recordingDuration != null) {
      return `${this._getMMSSFromMillis(this.state.recordingDuration)}`;
    }
    return `${this._getMMSSFromMillis(0)}`;
  }

  render() {
    if (!this.state.haveRecordingPermissions) {
      return (
        <View style={styles.container}>
          <View />
          <Text style={styles.noPermissionsText}>
            You must enable audio recording permissions in order to use this
            app.
          </Text>
          <View />
        </View>
      );
    }

    return (
      <View style={styles.container}>
          <View style={styles.recordingContainer}>
            <TouchableOpacity
              onPress={this._onRecordPressed}
              disabled={this.state.isLoading}
            >
              {this.state.isRecording ? (
                <Ionicons name="ios-mic" size={80} color="red" />
              ) : (
                <Ionicons name="ios-mic" size={80} color="black" />
              )}
            </TouchableOpacity>
            <Text style={styles.recordingTimestamp}>
              {this._getRecordingTimestamp()}
            </Text>
          </View>
        <View
          style={[
            styles.halfScreenContainer,
            {
              opacity:
                !this.state.isPlaybackAllowed || this.state.isLoading
                  ? DISABLED_OPACITY
                  : 1.0,
            },
          ]}
        >
          <View style={styles.playbackContainer}>
            <Slider
              style={styles.playbackSlider}
              value={this._getSeekSliderPosition()}
              onValueChange={this._onSeekSliderValueChange}
              onSlidingComplete={this._onSeekSliderSlidingComplete}
              disabled={!this.state.isPlaybackAllowed || this.state.isLoading}
            />
            <Text style={styles.playbackTimestamp}>
              {this._getPlaybackTimestamp()}
            </Text>
          </View>

          <View style={styles.buttonsContainer}>
            <View style={styles.playStopContainer}>
              <TouchableOpacity
                onPress={this._onStopPressed}
                disabled={!this.state.isPlaybackAllowed || this.state.isLoading}
              >
                <Entypo name="controller-stop" size={50} color="black" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={this._onPlayPausePressed}
                disabled={!this.state.isPlaybackAllowed || this.state.isLoading}
              >
                {this.state.isPlaying ? (
                  <Ionicons name="ios-pause" size={50} color="black" />
                ) : (
                  <Ionicons name="ios-play" size={50} color="black" />
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.volumeContainer}>
              <TouchableOpacity
                onPress={this._onMutePressed}
                disabled={!this.state.isPlaybackAllowed || this.state.isLoading}
              >
                {this.state.muted ? (
                  <Octicons name="mute" size={40} color="black" />
                ) : (
                  <Octicons name="unmute" size={40} color="black" />
                )}
              </TouchableOpacity>
              <Slider
                style={styles.volumeSlider}
                value={1}
                onValueChange={this._onVolumeSliderValueChange}
                disabled={!this.state.isPlaybackAllowed || this.state.isLoading}
              />
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  noPermissionsText: {
    textAlign: 'center',
  },
  halfScreenContainer: {
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  recordingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playbackContainer: {
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    margin: 20,
  },
  playbackSlider: {
    width: DEVICE_WIDTH / 1.5,
  },
  recordingTimestamp: {
    fontSize: 34,
    paddingLeft: 20,
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
    width: DEVICE_WIDTH / 3.0,
  },
});
