import { useFonts } from '@expo-google-fonts/quicksand';
import React, { useState } from 'react';
import { View, Text, useWindowDimensions, StyleSheet, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Rating } from 'react-native-ratings';
import { ActionSheetProvider, useActionSheet } from '@expo/react-native-action-sheet';
import { MaterialIcons } from '@expo/vector-icons';
import CustomRating from './Rating';

const FeedComponent = ({ imagenURL, perfil, imagenPerfilURL }) => {

  const { width } = useWindowDimensions();
  const { showActionSheetWithOptions } = useActionSheet();

  const [loadingImage, setLoadingImage] = useState(true);
  //const [loadingImage, setLoadingImage] = useState(false);
  const [error, setError] = useState(false);
  const [rating, setRating] = useState(0);
  const [initialRating, setInitialRating] = useState(3);

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

  const reportImage = (reason) => {
    console.log("Imagen reportada por:", reason);
    //Acción al reportar
  };

  const options = ['No cumple con la consigna', 'Es ofensivo', 'Cancelar'];

  const showActionSheet = () => {
    showActionSheetWithOptions(
      {
        options: options,
        cancelButtonIndex: options.length - 1,
        cancelButtonTintColor: 'red',
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

  return (
    <View style={[styles.container, { width: width }]}>
      <View style={styles.headerContainer}>
        <TouchableOpacity>
          <Image
            source={imagenPerfilURL}
            style={styles.profileImage}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.userNameFeed}>
            {perfil}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{ width: width, height: 100}}>
        <Image
          source={{uri: imagenURL}}
          style={[styles.imageFeed]}
          //onLoadStart={handleLoadStart}
          //onLoadEnd={handleLoadEnd}
          onError={handleLoadError}
          resizeMode='cover'
        />
        {loadingImage && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="black" />
          </View>
        )}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={{ color: 'red' }}>No se pudo cargar la imagen</Text>
          </View>
        )}
      </View>
      <View style={styles.ratingContainer}>
          <CustomRating
            maxRating={5}
            defaultRating={initialRating}
            onRatingChange={ratingCompleted}
          />
        <TouchableOpacity onPress={showActionSheet}>
         <MaterialIcons name={'report-problem'} size={30} color={'black'} />
        </TouchableOpacity>
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
  imageFeed: {
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
});

const FeedComponentWithActionSheet = (props) => (
  <ActionSheetProvider>
    <FeedComponent {...props} />
  </ActionSheetProvider>
);

export default FeedComponentWithActionSheet;
