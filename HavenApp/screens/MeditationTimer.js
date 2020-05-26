import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Platform,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
import CountDown from 'react-native-countdown-component';

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
  };

  const resetTimer = () => {
    setReset('reset');
  };

  const beginSession = () => {
    setTimerRunning(true);
  };

  const stopSession = () => {
    //resetTimer();
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
        {!showTimer && (
          <View style={styles.container}>
            <TextInput
              style={styles.input}
              autoCorrect={false}
              keyboardType="number-pad"
              maxLength={2}
              onChangeText={inputHandler}
              value={enteredValue}
              placeholder="Enter minutes"
            />
            <TouchableOpacity
              style={styles.beginButton}
              onPress={confirmedInputHandler}
            >
              <Text style={styles.whiteText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        )}

        {showTimer && (
          <View>
            <View style={styles.textView}>
              <Text style={styles.blackText}>
                Close your eyes, relax, and breath naturally.
              </Text>
            </View>

            <CountDown
              id={reset}
              until={chosenNumber}
              size={30}
              timeToShow={['M', 'S']}
              onFinish={stopSession}
              running={timerRunning}
            />
          </View>
        )}

        {!timerRunning && showTimer && (
          <TouchableOpacity style={styles.beginButton} onPress={beginSession}>
            <Text style={styles.whiteText}>Start</Text>
          </TouchableOpacity>
        )}

        {timerRunning && showTimer && (
          <TouchableOpacity style={styles.stopButton} onPress={stopSession}>
            <Text style={styles.whiteText}>Pause</Text>
          </TouchableOpacity>
        )}

        {showTimer && (
          <TouchableOpacity style={styles.stopButton} onPress={resetMeditation}>
            <Text style={styles.whiteText}>Reset</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  beginButton: {
    margin: 20,
    padding: 20,
    backgroundColor: '#4CAF50',
    width: '60%',
  },
  stopButton: {
    margin: 20,
    padding: 20,
    backgroundColor: '#F44336',
    width: '60%',
  },
  whiteText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 20,
  },
  blackText: {
    fontSize: 18,
  },
  textView: {
    paddingBottom: 20,
  },
  input: {
    height: 30,
    width: '50%',
    textAlign: 'center',
  },
});

export default MeditationTimer;
