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

const FollowerComponent = ({ perfil, imagenPerfilURL, fromScreen, follows }) => {

  const [follow, setFollow] = useState(follows)
  const { width, height } = useWindowDimensions();
  const { showActionSheetWithOptions } = useActionSheet();

  const navigation = useNavigation();

  const {token, user} = useAuth();

  //const [loadingImage, setLoadingImage] = useState(true);
  const [loadingImage, setLoadingImage] = useState(false);
  const [error, setError] = useState(false);
  const [initialRating, setInitialRating] = useState(3);
  const [loading, setLoading] = useState(false);

  let [fontsLoaded] = useFonts({
    'Quicksand-Regular': require('../assets/fonts/Quicksand-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return null; // Esperando a que se carguen las fuentes
  }

  const handleUserSearch = () => {
    console.log('Image pressed');
    console.log('Navegar al perfil');
    navigation.navigate('profile', {
      fromScreen: fromScreen,
      userData: perfil 
    });
  }

  const handleFollow = async () => {
    setLoading(true);
    const seguidor = user;
    //const seguido = 'Hola';
    const seguido = perfil && perfil.startsWith('@') ? perfil.slice(1) : perfil;
    const url = `${SERVER}/users/follow/${encodeURIComponent(seguidor)}/${encodeURIComponent(seguido)}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        if (response.status === 200) {
            console.log('User followed successfully');
            setFollow(true);
        } else {
            console.error('Hubo un problema con la solicitud HTTP:', response.status);
        }
    } catch (error) {
        console.error('Error en la operación de follow:', error.message);
    } finally {
        setLoading(false);
    }
}

const handleUnfollow = async () => {
    setLoading(true);
    const seguidor = user;
    //const seguido = 'Hola';
    const seguido = perfil && perfil.startsWith('@') ? perfil.slice(1) : perfil;
    const url = `${SERVER}/users/unfollow/${encodeURIComponent(seguidor)}/${encodeURIComponent(seguido)}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        if (response.status === 200) {
            console.log('User unfollowed successfully');
            setFollow(false);
        } else {
            console.error('Hubo un problema con la solicitud HTTP:', response.status);
        }
    } catch (error) {
        console.error('Error en la operación de follow:', error.message);
    } finally {
        setLoading(false);
    }
}

  const handleFollowPress = () => {
    if (follow) {
      handleUnfollow();
    } else {
      handleFollow();
    }
  }

  return (
    <View style={[styles.container, { height: height * 0.10, width: width }]}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handleUserSearch}>
          <View style={{flexDirection: 'row'}}>
            {typeof imagenPerfilURL === "undefined" ? 
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
            <Text style={styles.userNameFeed}>
              @{perfil}
            </Text>
          </View>
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'flex-end' }}>
          <TouchableOpacity style={styles.followButton} onPress={handleFollowPress}>
            {loading ? 
              <ActivityIndicator size="small" color='white' /> 
            : 
              <Text style={styles.buttonText}>{follow ? 'Eliminar' : 'Seguir'}</Text>
            }
          </TouchableOpacity>
        </View>
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
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: 'white',
  },
  userNameFeed: {
    fontFamily: 'Quicksand-Regular',
    paddingHorizontal: 20,
    fontSize: 16,
    alignSelf: 'center',
  },
  followButton: {
    backgroundColor: '#390294',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    marginRight: 10,
    width: 100,
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
  },
});

export default FollowerComponent;
