import { useFonts } from '@expo-google-fonts/quicksand';
import React, { useEffect, useState } from 'react';
import { View, Text, useWindowDimensions, StyleSheet, Image, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { Rating } from 'react-native-ratings';
import { ActionSheetProvider, useActionSheet } from '@expo/react-native-action-sheet';
import { MaterialIcons } from '@expo/vector-icons';
import CustomRating from './Rating';
import { SERVER } from '../utils/utils';
import { useAuth } from './AuthContext';

const UserSearchComponent = ({ perfil, imagenPerfilURL }) => {

  const { width, height } = useWindowDimensions();
  const { showActionSheetWithOptions } = useActionSheet();

  const {user} = useAuth();

  //const [loadingImage, setLoadingImage] = useState(true);
  const [loadingImage, setLoadingImage] = useState(false);
  const [error, setError] = useState(false);
  const [initialRating, setInitialRating] = useState(3);

  let [fontsLoaded] = useFonts({
    'Quicksand-Regular': require('../assets/fonts/Quicksand-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return null; // Esperando a que se carguen las fuentes
  }

  return (
    <View style={[styles.container, { height: height * 0.15 }]}>
      <View style={styles.headerContainer}>
        <TouchableOpacity>
          <View style={{flexDirection: 'row'}}>
            <Image
              source={{uri: imagenPerfilURL}}
              style={styles.profileImage}
            />
            <Text style={styles.userNameFeed}>
              {perfil}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#e5e5e5',
    padding: 10,
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
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'white',
  },
  userNameFeed: {
    fontFamily: 'Quicksand-Regular',
    paddingHorizontal: 30,
    fontSize: 20,
    alignSelf: 'center',
  },
});

export default UserSearchComponent;
