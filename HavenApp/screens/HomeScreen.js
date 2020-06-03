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
} from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { addImage } from '../store/actions';
import * as ImagePicker from 'expo-image-picker';

const HomeScreen = (props) => {
  const [selectedImage, setSelectedImage] = React.useState(false);
  const image = require('../assets/backgrounds/Home.png');

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
    setSelectedImage(true);
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
          {selectedImage && (
            <Image source={{ uri: pictureUri }} style={styles.homeImage} />
          )}
          {!selectedImage && (
            <Text style={styles.infoText}>
              Press choose image to display a picture here
            </Text>
          )}
        </View>
        <View style={styles.buttonContainer}>
          <View style={styles.row}>
            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate('MeditationTimer');
              }}
            >
              <MaterialCommunityIcons name="brain" size={60} color="black" />
              <Text>Meditate</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate('Record');
              }}
            >
              <MaterialIcons name="audiotrack" size={60} color="black" />
              <Text>Monologues</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate('DrawPad');
              }}
            >
              <MaterialCommunityIcons name="draw" size={60} color="black" />
              <Text>Drawing Pad</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={openImagePickerAsync}>
              <Entypo name="image-inverted" size={60} color="black" />
              <Text>Choose image</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.row}>
            <Button
              title="Signout"
              onPress={SignOutHandler}
              titleStyle={{
                color: 'red',
              }}
              type="clear"
            />
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-evenly',
  },
  homeImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  homeImage: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
  },
  row: {
    margin: 15,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  infoText: {
    fontSize: 18,
  },
});

export default withFirebaseHOC(HomeScreen);
