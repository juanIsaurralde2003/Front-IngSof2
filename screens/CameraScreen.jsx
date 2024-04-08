// CameraScreen.jsx
/*import React, { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const CameraScreen = () => {

  const [imagen, setImagen] = useState(null);

  const takePhoto = async () => {
    try {
      await ImagePicker.requestCameraPermissionsAsync();
    
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, 
        allowsEditing: true, 
        aspect: [1, 1], 
        quality: 1,
      });
    
      if (!result.cancelled) {
        setImagen(result.assets[0].uri);
      }
    } catch (error) {
      console.log('Ocurrió un error:', error);
    }
  };

  const handleSavePost = async () => {

    const username = '@user';

    const url = `${SERVER}/posts/${username}`;

    const data = new FormData();

    if (imagen) {
      const uriParts = imagen.split('.');
      const fileType = uriParts[uriParts.length - 1];

      const nombreArchivo = `nombre_imagen`;

      data.append('', {
        uri: imagen,
        name: `${nombreArchivo}.${fileType}`,
        type: `image/${fileType}`,
      });
    }
    
    // data = {
    //   imageURL: '', //url de la imagen
    // }

    try {
      const respuesta = await fetch(url, {
        method: 'POST', 
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: data,
      });
  
      if (respuesta.status === 201) {
        
      }
    } catch (error) {
      console.error('Error al realizar la solicitud:', error);
    } finally {
      setIsLoginLoading(false);
    }
    
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TouchableOpacity onPress={takePhoto} style={{ padding: 14, backgroundColor: '#505050', borderRadius: 25 }}>
        <Text style={{ color: 'white', fontSize: 20 }}>Take Photo</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CameraScreen;



/*
import React from "react";
import { ScrollView, View } from "react-native-web";


const CameraScreen = () => {
    return(
        <ScrollView>
            <View>
                <h1>Hola mundo</h1>
            </View>
        </ScrollView>
    )
}

export default CameraScreen;
*/

/*
import React, { useRef } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { RNCamera } from 'react-native-camera';

const CameraScreen = () => {
  const cameraRef = useRef(null);

  const takePicture = async () => {
    if (cameraRef.current) {
      const options = { quality: 0.5, base64: true };
      const data = await cameraRef.current.takePictureAsync(options);
      console.log(data.uri);
      // You can handle the captured image data here
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <RNCamera
        ref={cameraRef}
        style={{ flex: 1 }}
        type={RNCamera.Constants.Type.back}
        captureAudio={false}
      />
      <TouchableOpacity onPress={takePicture} style={{ alignSelf: 'center' }}>
        <Text style={{ fontSize: 20, marginBottom: 10, color: 'white' }}>Take Picture</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CameraScreen;
*/

import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';

const CameraScreen = ({ onCapture, setIsCameraOpen }) => {

  const navigation = useNavigation();

  useEffect(() => {
    const takePhoto = async () => {
      try {
        await ImagePicker.requestCameraPermissionsAsync();
        let result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
        if (!result.canceled) {
          console.log('Capturé imagen')
          onCapture(result.assets[0].uri);          
        }
        setIsCameraOpen(false);
      } catch (error) {
        console.log('Ocurrió un error:', error);
      }
    };
    takePhoto();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: 'white', fontSize: 20 }}>Abriendo la cámara...</Text>
    </View>
  );
};

export default CameraScreen;
