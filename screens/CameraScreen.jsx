import React, { useState, useEffect } from 'react';
import { View, Text, Alert, Linking } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';

const CameraScreen = ({ onCapture, setIsCameraOpen }) => {

  const navigation = useNavigation();  

  useEffect(() => {
    const takePhoto = async () => {
      try {
        await ImagePicker.requestCameraPermissionsAsync({
          permissionDialogTitle: 'Permiso necesario',
          permissionDialogMessage: 'La aplicación necesita acceder a la cámara para tomar fotos. ¿Conceder permisos?',
        });

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
      } catch (error) {
        Alert.alert('Los permisos para la cámara no están activados')
        console.log('Ocurrió un error:', error);
      } finally {
        setIsCameraOpen(false);
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