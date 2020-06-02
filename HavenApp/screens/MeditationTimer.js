import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  ImageBackground,
} from 'react-native';
import CountDown from 'react-native-countdown-component';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';

const MeditationTimer = (props) => {
  const [enteredValue, setEnteredValue] = useState('');
  const [chosenNumber, setChosenNumber] = useState();
  const [showTimer, setShowTimer] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);
  const [reset, setReset] = useState();

  const resetInput = () => {
    setEnteredValue('');
  };

  const inputHandler = (inputText) => {
    setEnteredValue(inputText.replace(/[^0-9]/g, ''));
  };

  const confirmedInputHandler = () => {
    const number = parseInt(enteredValue);
    if (isNaN(number) || number <= 0 || number > 59) {
      Alert.alert('Invalid minutes!', 'Minutes have to be between 1 and 59', [
        { text: 'Okay', style: 'destructive', onPress: resetInput },
      ]);
      return;
    }
    setChosenNumber(number * 60);
    resetInput();
    Keyboard.dismiss();
    setShowTimer(true);
    beginSession();
  };

  const beginSession = () => {
    setTimerRunning(true);
  };

  const stopSession = () => {
    setTimerRunning(false);
  };

  const resetMeditation = () => {
    resetInput();
    stopSession();
    setChosenNumber();
    setShowTimer(false);
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <View style={styles.container}>
        <ImageBackground
          source={require('../assets/backgrounds/Meditation.png')}
          style={styles.image}
        >
          {!showTimer && (
            <View style={styles.startContainer}>
              <TextInput
                style={styles.input}
                autoCorrect={false}
                keyboardType="number-pad"
                maxLength={2}
                onChangeText={inputHandler}
                value={enteredValue}
                placeholder="Enter minutes"
                placeholderTextColor="white"
              />

              <TouchableOpacity onPress={confirmedInputHandler}>
                <AntDesign name="play" size={90} color="white" />
              </TouchableOpacity>
            </View>
          )}

          {showTimer && (
            <View style={styles.startContainer}>
              <View>
                <Text style={styles.infoText}>
                  Close your eyes, relax, and breath naturally.
                </Text>

                <CountDown
                  id={reset}
                  until={chosenNumber}
                  size={50}
                  digitStyle={styles.countdownDigits}
                  digitTxtStyle={{ color: 'white' }}
                  timeToShow={['M', 'S']}
                  onFinish={stopSession}
                  running={timerRunning}
                  separatorStyle={{ color: 'white' }}
                  timeLabels={{ m: null, s: null }}
                  showSeparator
                />
              </View>

              <View>
                {!timerRunning && (
                  <TouchableOpacity onPress={beginSession}>
                    <AntDesign name="play" size={90} color="white" />
                  </TouchableOpacity>
                )}
                {timerRunning && (
                  <TouchableOpacity onPress={stopSession}>
                    <AntDesign name="pausecircle" size={90} color="white" />
                  </TouchableOpacity>
                )}
              </View>
              <TouchableOpacity onPress={resetMeditation}>
                <MaterialCommunityIcons name="restart" size={50} color="red" />
              </TouchableOpacity>
            </View>
          )}
        </ImageBackground>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  countdownDigits: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    borderWidth: 1,
    borderColor: 'black',
  },
  infoText: {
    color: 'white',
    paddingBottom: 20,
    fontSize: 20,
  },
  container: {
    flex: 1,
  },
  startContainer: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  input: {
    height: 150,
    width: '100%',
    textAlign: 'center',
    textAlignVertical: 'center',
    color: 'white',
    fontSize: 30,
    margin: 15,
    padding: 20,
  },
});

export default MeditationTimer;
