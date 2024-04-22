import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; 
import { Camera } from 'expo-camera';
import Header from '../components/Header';
import { useNavigation } from '@react-navigation/native';
import CameraScreen from './CameraScreen';
import { SERVER } from '../utils/utils';
import { useAuth } from '../components/AuthContext';

const ChallengeScreen = () => {

  const navigation = useNavigation();

  const [challengeData, setChallengeData] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [savingImage, setSavingImage] = useState(false);
  const cameraRef = useRef(null);

  const {user} = useAuth();

  
  // useEffect(() => {
  //   // Simulación de la solicitud de datos del reto desde un endpoint
  //   const fetchChallengeData = async () => {
      
  //     // Por ahora, simulamos la obtención de datos
  //     const challengeData = {
  //       name: 'foto artística',
  //       description: 'Sube una foto panorámica de la vista más linda que encuentres desde la ventana de tu hogar.',
  //     };
  //     setChallengeData(challengeData);
  //   };

  //   fetchChallengeData();

  // }, []);

  useEffect(() => {
    const getChallenge = async () => {

      const url = `${SERVER}/posts/prompt`;

      try {
        const response = await fetch(url, { method: 'GET' });

        if (response.ok) {
          const data = await response.json();
    
          console.log(data);
    
          const challengeData = {
            name: 'foto artística',
            description: data.prompt,
          };
          setChallengeData(challengeData);
        } else {
          console.error('Error al obtener challenge');
        }
      } catch (error) {
        console.error('Error de red:', error);
      } 
    };

    getChallenge();
  }, []);

  const handlePressCamera = async () => {
      //navigation.navigate('camera');
      // const { status } = await Camera.requestCameraPermissionsAsync();
      // if (status === 'granted') {
          setIsCameraOpen(true);
      // } else {
      //   alert('Se requiere permiso para acceder a la cámara.');
      // }
  };

  const handleCaptureImage = async (capturedImage) => {
    console.log('Imagen capturada');
    setImage(capturedImage);
    console.log(capturedImage);
    setSavingImage(true);
    await handleSavePost(capturedImage);
    navigation.navigate('feed');
    setSavingImage(false);
  }

  const handleSavePost = async (image) => {

    const url = `${SERVER}/posts`;

    const data = new FormData();
    data.append('username', user);

    console.log(data);

    if (image) {
      console.log('Entro a image')
      const uriParts = image.split('.');
      const fileType = uriParts[uriParts.length - 1];

      const fecha = new Date().toISOString().split('T')[0];

      console.log(fecha);

      const nombreArchivo = `${user}_${fecha}`;

      console.log(nombreArchivo);

      data.append('file', {
        uri: image,
        name: `${nombreArchivo}.${fileType}`,
        type: `image/${fileType}`,
      });
    }
    
    try {
      const respuesta = await fetch(url, {
        method: 'POST', 
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: data,
      });
  
      if (respuesta.ok) {
        console.log('Hecho');
      } else {
        console.error('Algo salió mal');
      }
    } catch (error) {
      console.error('Error al realizar la solicitud:', error);
    }
      
  };

  return (
    <View style={styles.container}>
      <Header userProfilePic="https://cdn-icons-png.freepik.com/512/64/64572.png" />
      
      {isCameraOpen ? (
        // <Camera
        //   ref={cameraRef}
        //   style={styles.camera}
        //   type={Camera.Constants.Type.front} // Usar la cámara frontal
        //   ratio="16:9" // Ratio de aspecto
        // />
        <CameraScreen onCapture={(image) => handleCaptureImage(image)} setIsCameraOpen={setIsCameraOpen} />
      ) : (
        <View style={styles.content}>
          {savingImage ? (
            <View>
              <ActivityIndicator size="large" color="#390294" style={styles.loadingIndicator} />
            </View>
          ) : (
            <>
            <Text style={styles.challengeHeaderText}>Reto diario: {challengeData?.name}</Text>
            <TouchableOpacity style={styles.challengeDescriptionContainer}>
              <Text style={styles.challengeDescription}>{challengeData?.description}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handlePressCamera}>
              <FontAwesome name="camera" size={20} color="white" style={styles.cameraIcon} />
              <Text style={styles.buttonText}>Adelante</Text>
            </TouchableOpacity>
            </>

          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    content: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingTop: 50, 
    },
    challengeHeaderText: {
      fontSize: 24,
      marginBottom: 20,
      fontFamily: 'Quicksand-Bold',
    },
    challengeDescriptionContainer: {
      backgroundColor: '#c7c7f1',
      padding: 20,
      margin: 30,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.27,
      shadowRadius: 4.65,
      elevation: 6,
    },
    challengeDescription: {
      fontSize: 24,
      fontFamily: 'Quicksand',
      textAlign: 'center',
    },
    button: {
      backgroundColor: '#390294',
      flexDirection: 'row',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 10,
      marginTop: 20, 
      alignItems: 'center', 
    },
    buttonText: {
      color: '#fff',
      fontSize: 18,
      fontFamily: 'Quicksand-Bold',
    },
    cameraIcon: {
      marginRight: 10, 
    },
    camera: {
        flex: 1,
      },
  });

export default ChallengeScreen;



