import { useFonts } from '@expo-google-fonts/quicksand';
import React, { useEffect, useState } from 'react';
import { View, Text, useWindowDimensions, StyleSheet, Image, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { Rating } from 'react-native-ratings';
import { ActionSheetProvider, useActionSheet } from '@expo/react-native-action-sheet';
import { MaterialIcons } from '@expo/vector-icons';
import CustomRating from './Rating';
import { SERVER } from '../utils/utils';
import { useAuth } from './AuthContext';
import { useNavigation } from '@react-navigation/native';

const FeedComponent = ({ imagenURL, perfil, imagenPerfilURL, isSelfPost, setReportedImages, score, userScore }) => {

  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const { showActionSheetWithOptions } = useActionSheet();

  const {user, token} = useAuth();

  //const [loadingImage, setLoadingImage] = useState(true);
  const [loadingImage, setLoadingImage] = useState(false);
  const [error, setError] = useState(false);
  const [rating, setRating] = useState(0);
  const [initialRating, setInitialRating] = useState(3);
  const [scoreVar, setScoreVar] = useState(score);

  let [fontsLoaded] = useFonts({
    'Quicksand-Regular': require('../assets/fonts/Quicksand-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return null; // Esperando a que se carguen las fuentes
  }

  const star_image = require('../assets/star.png')

  const ratingCompleted = (rating) => {
    setRating(rating);
  }

  const handleLoadStart = () => {
    setLoadingImage(true);
    setError(false);
  };

  const handleLoadEnd = () => {
    setLoadingImage(false);
  };

  const handleLoadError = () => {
    setLoadingImage(false);
    setError(true);
  };

  const reportImage = async (reason) => {
    console.log("Imagen reportada por:", reason);
    
    const url = `${SERVER}/posts/report`
  
    const data = {
      imageURL: imagenURL,
      username: user,
      report: reason === 'No cumple con la consigna' ? 'notPrompt' : 'inappropriate',
    }
  
    try {
      const respuesta = await fetch(url, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
    
      if (respuesta.status === 200) {
        Alert.alert('Éxito', 'Reporte realizado con éxito');
        const reportedImage = { imageURL: imagenURL, username: user };
        setReportedImages(prevReportedImages => [...prevReportedImages, reportedImage]);
      } else {
        console.error('Respuesta HTTP no exitosa:', respuesta.status);
         
      }
    } catch (error) {
      console.error('Error al realizar la solicitud:', error);
    }
  };

  const options = ['No cumple con la consigna', 'Es ofensivo', 'Cancelar'];

  const showActionSheet = () => {
    showActionSheetWithOptions(
      {
        options: options,
        cancelButtonIndex: options.length - 1,
        cancelButtonTintColor: 'red',
        position: 'bottom',
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          reportImage("No cumple con la consigna");
        } else if (buttonIndex === 1) {
          reportImage("Es ofensivo");
        }
      }
    );
  };

  const handleProfilePress = () => {
    console.log('Image pressed');
    console.log('Navegar al perfil');
    navigation.navigate('profile', {
      fromScreen: 'feed',
      userData: perfil
    });
  }

  return (
    <View style={[styles.container, { width: width }]}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handleProfilePress}>
          {imagenPerfilURL === null ? 
            <Image
              source={require("../assets/person.jpg")}
              style={styles.profileImage}
            />
          :
              <Image
              source={{uri: imagenPerfilURL}}
              style={styles.profileImage}
            />
          }
        </TouchableOpacity>
        <TouchableOpacity onPress={handleProfilePress}>
          <Text style={styles.userNameFeed}>
            {perfil}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{ width: width}}>
        <Image
          source={{uri: imagenURL}}
          style={{width: width, aspectRatio: 1}}
          onLoadStart={handleLoadStart}
          onLoadEnd={handleLoadEnd}
          //onLoadStart={() => console.log('Carga iniciada')}
          //onLoadEnd={() => console.log('Cargada')}
          onError={handleLoadError}
          //onError={() => console.log('Error')}
          //resizeMode='contain'
        />
        {loadingImage && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#390294" />
          </View>
        )}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={{ color: 'red' }}>No se pudo cargar la imagen</Text>
          </View>
        )}
      </View>
      <View style={styles.ratingContainer}>
        <View style={styles.scoreContainer}>
          <CustomRating
            maxRating={5}
            defaultRating={userScore ? userScore : 0}
            onRatingChange={ratingCompleted}
            imageUrl={imagenURL}
            username={user}
            setScore={setScoreVar}
          />
          <Text style={styles.score}>{scoreVar}</Text>
        </View>
        {!isSelfPost && (
          <TouchableOpacity onPress={showActionSheet}>
            <MaterialIcons name={'report-problem'} size={30} color={'black'} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#e5e5e5',
    paddingVertical: 10,
  },
  headerContainer: {
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 10,
    width: '100%',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  userNameFeed: {
    fontFamily: 'Quicksand-Regular',
    paddingHorizontal: 20,
    fontSize: 14,
    alignSelf: 'center',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  score: {
    fontSize: 20,
    color: '#DAA520',
    marginLeft: 10,
  }
});

const FeedComponentWithActionSheet = (props) => (
    <FeedComponent {...props} />
);

export default FeedComponentWithActionSheet;
