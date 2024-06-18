import React, { useEffect, useState } from 'react';
import { Animated, Image, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FeedComponentWithActionSheet from '../components/FeedComponent';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { SERVER } from '../utils/utils';
import { useAuth } from '../components/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NotificationCenter } from '../components/NotificationCenter';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';

const FeedScreen = () => {

  const navigation = useNavigation();

  const { user, token, profilePicture } = useAuth();

  const [feedData, setFeedData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [feedError, setFeedError] = useState(false);

  const [reportedImages, setReportedImages] = useState([]);

  const getPosts = async () => {

    const url = `${SERVER}/posts/feed/${user}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();

        console.log(data);
        console.log(data.post);
        setFeedError(false);
        setFeedData(data.post);
      } else {
        console.log(response.status);
        console.log(response)
        //console.error('Error al obtener posts');
        setFeedError(true);
      }
    } catch (error) {
      //console.error('Error de red:', error);
    }
  };

  const getChallenge = async () => {

    const url = `${SERVER}/posts/prompt`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();

        console.log(data);

        setReto(data.prompt);
      } else {
        //console.error('Error al obtener challenge');
      }
    } catch (error) {
      //console.error('Error de red:', error);
    }
  };

  const onFocus = () => {
    setRefreshing(true);
    getChallenge();
    getPosts();
    setRefreshing(false);
  };

  useEffect(() => {
    const retrieveReportedImages = async () => {
      try {
        const storedImages = await AsyncStorage.getItem('reportedImages');
        if (storedImages !== null) {
          setReportedImages(JSON.parse(storedImages));
        }
      } catch (error) {
        //console.error('Error al recuperar las imágenes reportadas:', error);
      }
    };

    retrieveReportedImages();
  }, []);

  useEffect(() => {
    const storeReportedImages = async () => {
      try {
        await AsyncStorage.setItem('reportedImages', JSON.stringify(reportedImages));
      } catch (error) {
        //console.error('Error al guardar las imágenes reportadas:', error);
      }
    };

    // Guardar las imágenes al salir de la pantalla
    const unsubscribe = navigation.addListener('blur', storeReportedImages);

    // Limpieza del efecto
    return unsubscribe;
  }, [reportedImages, navigation]);

  useEffect(() => {
    // Agregar evento de enfoque al documento
    const unsubscribe = navigation.addListener('focus', onFocus);

    // Limpieza del efecto
    return unsubscribe;

  }, []);

  const [reto, setReto] = useState('Cargando ...');

  const [scrollOffsetY] = useState(new Animated.Value(0));

  const handleProfilePress = () => {
    console.log('Image pressed');
    console.log('Navegar al perfil');
    navigation.navigate('profile', {
      fromScreen: 'feed',
      userData: user
    });
  }

  const handleLupaPress = () => {
    console.log('Lupa pressed');
    console.log('Navegar al buscador de perfiles');
    navigation.navigate('search', { fromScreen: 'feed' });
  }

  const dynamicHeaderStyle = {
    opacity: scrollOffsetY.interpolate({
      inputRange: [0, 100], // Cambia estos valores según tus necesidades
      outputRange: [1, 0], // Cambia estos valores según tus necesidades
      extrapolate: 'clamp',
    }),
  };

  return (
    <ActionSheetProvider>
    <SafeAreaView style={{ flex: 1, backgroundColor: '#e5e5e5' }}>
      <View style={{ flex: 1, backgroundColor: '#e5e5e5' }}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={handleProfilePress}>
            <Image
              source={{ uri: profilePicture }}
              style={styles.profileImage}
            />
          </TouchableOpacity>
          <View style={{ marginLeft: 15 }}>
            <Text style={styles.headerText}>
              <Text style={styles.dontText}>DON'T</Text>
              <Text style={styles.beRealText}> BE REAL</Text>
            </Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <NotificationCenter
              fromScreen={'feed'}
              navigation={navigation}
            />
            <TouchableOpacity onPress={handleLupaPress}>
              <MaterialIcons name='search' size={35} color={'black'} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={[styles.dynamicHeader]}>
          <View style={styles.retoContainer}>
            <Text style={styles.challengeDescription} numberOfLines={6} adjustsFontSizeToFit>
              {reto}
            </Text>
          </View>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={15}
          contentContainerStyle={{ paddingBottom: 0, flexGrow: 1 }}
          bounces={false}
          onScroll={Animated.event([
            { nativeEvent: { contentOffset: { y: scrollOffsetY } } }
          ], {
            useNativeDriver: false,
          })}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onFocus}
              colors={['#9Bd35A', '#689F38']}
              progressBackgroundColor="#FFFFFF"
            />
          }
        >
          {feedError && (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 16, textAlign: 'center', color: 'gray', padding: 20 }}>
                Ha ocurrido un error al obtener las publicaciones. Por favor, inténtalo más tarde
              </Text>
            </View>
          )}
          {(feedData.length === 0 && !feedError) ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 16, textAlign: 'center', color: 'gray', padding: 20 }}>
                Las personas que sigues aún no han cumplido el reto. Sigue a más personas o espera a que cumplan el desafío.
              </Text>
            </View>
          ) : (
            feedData
              .filter(item => {
                // Verificar si la lista de imágenes reportadas contiene la URL de la imagen y el usuario actual
                return !reportedImages.some(reportedImage => reportedImage.imageURL === item.post.imageURL && reportedImage.username === user);
              })
              .map((item, index) => (
                <FeedComponentWithActionSheet
                  key={index}
                  imagenURL={item.post.imageURL}
                  perfil={item.author}
                  imagenPerfilURL={item.profilePicture}
                  isSelfPost={item.author === user}
                  score={item.post.score}
                  userScore={item.post.userScore}
                  setReportedImages={setReportedImages}
                />
              ))
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
    </ActionSheetProvider>
  );
};

const styles = StyleSheet.create({
  dynamicHeader: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 0,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#909090',
    backgroundColor: '#e5e5e5',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    width: '100%',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 50,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    //fontFamily: 'NotoSansTC-Regular', 
  },
  dontText: {
    color: '#000',
  },
  beRealText: {
    color: '#390294',
  },
  retoContainer: {
    paddingVertical: 20,
    paddingHorizontal: 25,
  },
  challengeDescription: {
    fontSize: 18,
    fontFamily: 'Quicksand',
    textAlign: 'center',
  },
});

export default FeedScreen;