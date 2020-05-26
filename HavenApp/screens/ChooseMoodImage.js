import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const ChooseMoodImage = (props) => {
  const [selectedImage, setSelectedImage] = React.useState(null);
  let content;

  let openImagePickerAsync = async () => {
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

    setSelectedImage({ localUri: pickerResult.uri });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={openImagePickerAsync}>
        <Text>Pick an image</Text>
      </TouchableOpacity>
      {selectedImage !== null && (
        <Image
          source={{ uri: selectedImage.localUri }}
          style={styles.thumbnail}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbnail: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },
});

export default ChooseMoodImage;
