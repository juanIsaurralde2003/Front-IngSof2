import React, { useEffect, useRef, useState } from 'react';
import { Animated, Image, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FeedComponentWithActionSheet from '../components/FeedComponent';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { SERVER } from '../utils/utils';
import { useAuth } from '../components/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FeedScreen = () => {
   
  const navigation = useNavigation();

  const {user, profilePicture} = useAuth();

  const [feedData, setFeedData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const [reportedImages, setReportedImages] = useState([]);

  const getPosts = async () => {

    const url = `${SERVER}/posts/feed/${user}`;

    try {
      const response = await fetch(url, { method: 'GET' });

      if (response.ok) {
        const data = await response.json();
  
        console.log(data);

        setFeedData(data.post);
      } else {
        console.error('Error al obtener posts');
      }
    } catch (error) {
      console.error('Error de red:', error);
    } 
  };

  const getChallenge = async () => {

    const url = `${SERVER}/posts/prompt`;

    try {
      const response = await fetch(url, { method: 'GET' });

      if (response.ok) {
        const data = await response.json();
  
        console.log(data);
  
        setReto(data.prompt);
      } else {
        console.error('Error al obtener challenge');
      }
    } catch (error) {
      console.error('Error de red:', error);
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
        console.error('Error al recuperar las imágenes reportadas:', error);
      }
    };

    retrieveReportedImages();
  }, []);

  useEffect(() => {
    const storeReportedImages = async () => {
      try {
        await AsyncStorage.setItem('reportedImages', JSON.stringify(reportedImages));
      } catch (error) {
        console.error('Error al guardar las imágenes reportadas:', error);
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

  const scrollOffsetY = useRef(new Animated.Value(0)).current;

  const Header_Max_Height = 240;
  const Header_Min_Height = 70;
  const Scroll_Distance = Math.min(Header_Max_Height - Header_Min_Height, 500);

  const handleProfilePress = () => {
    console.log('Image pressed');
    console.log('Navegar al perfil');
    navigation.navigate('profile', {
      fromScreen: 'feed',
      userData:user 
    });
  }

  const handleLupaPress = () => {
    console.log('Lupa pressed');
    console.log('Navegar al buscador de perfiles');
    navigation.navigate('search', { fromScreen: 'feed' });
  }

  const DynamicHeader = ({value}) => {

    const animatedHeaderHeight = value.interpolate({
      inputRange: [0, Scroll_Distance],
      outputRange: [Header_Max_Height, Header_Min_Height],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View style={[styles.dynamicHeader, { height: animatedHeaderHeight }]}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={handleProfilePress}>
            <Image
              source={{uri: profilePicture}}
              style={styles.profileImage}
            />
          </TouchableOpacity>
          <Text style={styles.headerText}>
            <Text style={styles.dontText}>DON'T</Text>
            <Text style={styles.beRealText}> BE REAL</Text>
          </Text>
          <TouchableOpacity onPress={handleLupaPress}>
            <MaterialIcons name='search' size={40} color={'black'} />
          </TouchableOpacity>
        </View>
        <View style={styles.retoContainer}>
          <Text style={styles.challengeDescription} numberOfLines={3} adjustsFontSizeToFit>
            {reto}
          </Text>
        </View>
      </Animated.View>
    )
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#e5e5e5'}}>
      <View style={{flex: 1, backgroundColor: '#e5e5e5'}}>
        <DynamicHeader value={scrollOffsetY}/>
        <ScrollView
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={15}
          contentContainerStyle={{paddingBottom: 0, flexGrow: 1}}
          bounces={false}
          onScroll={Animated.event([
            {nativeEvent: {contentOffset: {y: scrollOffsetY}}}
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
          {feedData.length === 0 ? (
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
                  setReportedImages={setReportedImages}
                />
            ))
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  dynamicHeader: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 25,
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
    fontSize: 24,
    fontFamily: 'Quicksand',
    textAlign: 'center',
  },
});

export default FeedScreen;