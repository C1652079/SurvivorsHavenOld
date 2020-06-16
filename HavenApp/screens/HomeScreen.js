import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ImageBackground,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Button } from 'react-native-elements';
import { withFirebaseHOC } from '../config/';
import {
  MaterialCommunityIcons,
  Entypo,
  MaterialIcons,
  Octicons,
} from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { addImage } from '../store/actions';
import * as ImagePicker from 'expo-image-picker';

const HomeScreen = (props) => {
  const image = require('../assets/backgrounds/Home1.png');
  const imageRecord = require('../assets/backgrounds/Home1.png');
  const pictureUri = useSelector((state) => state.images.imageUri);
  const dispatch = useDispatch();

  const openImagePickerAsync = async () => {
    let permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert(
        'Access Denied!',
        'Permission to access camera roll is required!',
        [{ text: 'Okay', style: 'destructive' }]
      );
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync();

    if (pickerResult.cancelled === true) {
      return;
    }

    addImageToDisplay(pickerResult.uri);
  };

  const SignOutHandler = async () => {
    try {
      await props.firebase.signOut();
      props.navigation.navigate('Auth');
    } catch (error) {
      console.log(error);
    }
  };

  const addImageToDisplay = (imageUri) => {
    dispatch(addImage(imageUri));
  };

  return (
    <ImageBackground source={image} style={styles.backgroundImage}>
      <View style={styles.container}>
        <View style={styles.homeImageContainer}>
          <View>
            <Text style={styles.homeScreenQuote}>"You are amazing"</Text>
          </View>

          {pictureUri !== '' && (
            <Image source={{ uri: pictureUri }} style={styles.homeImage} />
          )}
          {pictureUri === '' && (
            <Text style={styles.infoText}>
              Press choose image to display a picture here
            </Text>
          )}
        </View>
        <View style={styles.buttonContainer}>
          <View style={styles.row}>
            <View
              style={[
                styles.outerCircleBig,
                { backgroundColor: 'deepskyblue' },
              ]}
            >
              <TouchableOpacity
                style={styles.individualButton}
                onPress={() => {
                  props.navigation.navigate('MeditationTimer');
                }}
              >
                <MaterialCommunityIcons name="brain" size={55} color="white" />
                <Text style={styles.buttonText}>Meditate</Text>
              </TouchableOpacity>
            </View>

            <View
              style={[
                styles.outerCircleBig,
                { backgroundColor: 'palevioletred' },
              ]}
            >
              <TouchableOpacity
                style={styles.individualButton}
                onPress={() => {
                  props.navigation.navigate('Record');
                }}
              >
                <MaterialIcons name="audiotrack" size={55} color="white" />
                <Text style={styles.buttonText}>Record</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.row}>
            <View style={[styles.outerCircleBig, { backgroundColor: 'gold' }]}>
              <TouchableOpacity
                style={styles.individualButton}
                onPress={() => {
                  props.navigation.navigate('DrawPad');
                }}
              >
                <MaterialCommunityIcons name="draw" size={55} color="white" />
                <Text style={styles.buttonText}>Sketch</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.row}>
            <View
              style={[styles.outerCircleSmall, { backgroundColor: 'darkgray' }]}
            >
              <TouchableOpacity
                style={styles.individualButton}
                onPress={openImagePickerAsync}
              >
                <Entypo name="image-inverted" size={30} color="white" />
                <Text style={styles.buttonText}>Choose</Text>
              </TouchableOpacity>
            </View>
            <View
              style={[styles.outerCircleSmall, { backgroundColor: 'tomato' }]}
            >
              <TouchableOpacity
                style={styles.individualButton}
                onPress={SignOutHandler}
              >
                <Octicons name="sign-out" size={25} color="white" />
                <Text style={[styles.buttonText, { color: 'white' }]}>
                  Sign out
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
  },
  outerCircleBig: {
    shadowOpacity: 0.8,
    shadowRadius: 7,
    shadowOffset: {
      height: 5,
      width: 5,
    },
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
    width: '25%',
    height: '65%',
  },
  outerCircleSmall: {
    shadowOpacity: 0.8,
    shadowRadius: 7,
    shadowOffset: {
      height: 5,
      width: 5,
    },
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
    width: '20%',
    height: '60%',
  },
  buttonText: {
    color: 'black',
    fontSize: 12,
    flexWrap: 'wrap',
  },
  homeScreenQuote: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 28,
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  homeImageContainer: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  homeImage: {
    width: '60%',
    height: '80%',
    resizeMode: 'cover',
    borderRadius: 50,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  individualButton: {
    padding: 10,
    alignItems: 'center',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: 70,
    marginTop: 100,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  infoText: {
    fontSize: 18,
    color: 'white',
  },
});

export default withFirebaseHOC(HomeScreen);
