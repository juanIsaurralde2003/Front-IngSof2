import React, { useEffect } from 'react';
import { View, Text, Alert, Linking } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';

const CameraScreen = ({ onCapture, setIsCameraOpen }) => {

  const navigation = useNavigation();  

  useEffect(() => {

    const takePhoto = async () => {
      try {
        const { status } = await ImagePicker.requestCameraPermissionsAsync({
          permissionDialogTitle: 'Permiso necesario',
          permissionDialogMessage: 'La aplicación necesita acceder a la cámara para tomar fotos. ¿Conceder permisos?',
        });
    
        if (status !== 'granted') {
          Alert.alert(
            'Permisos necesarios',
            'Los permisos para la cámara no están activados',
            [
              { text: 'Cancelar', onPress: () => console.log('Cancelado') },
              { text: 'Otorgar permisos', onPress: () => Linking.openSettings() },
            ]
          );
          console.log('Permisos de cámara no concedidos');
          return;
        }
    
        let result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
    
        if (!result.canceled) {
          console.log('Capturé imagen');
          onCapture(result.assets[0].uri);
        }
      } catch (error) {
        Alert.alert('Error', 'Ocurrió un error al intentar abrir la cámara');
        console.log('Ocurrió un error:', error);
      } finally {
        setIsCameraOpen(false);
      }
    };
    
    // Llamar a la función takePhoto
    takePhoto();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: 'white', fontSize: 20 }}>Abriendo la cámara...</Text>
    </View>
  );
};

export default CameraScreen;