import React, { useEffect, useRef, useState } from 'react';
import { Animated, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FeedComponentWithActionSheet from '../components/FeedComponent';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { SERVER } from '../utils/utils';

const FeedScreen = () => {
   
  const navigation = useNavigation();

  const [feedData, setFeedData] = useState([]);

  useEffect(() => {
    const getPosts = async () => {

      const url = `${SERVER}/posts`;

      try {
        const response = await fetch(url, { method: 'GET' });

        if (response.ok) {
          const data = await response.json();
    
          console.log(data);
    
          const mergedData = data.map((item, index) => {
            const mergedItem = {
              imageURL: item.post.imageURL,
              perfil: feedDataHardcode[index % feedDataHardcode.length].perfil,
              imagenPerfilURL: feedDataHardcode[index % feedDataHardcode.length].imagenPerfilURL,
            };
            return mergedItem;
          });
    
          // Actualizar feedData con los datos fusionados
          setFeedData(mergedData);
        } else {
          console.error('Error al obtener posts');
        }
      } catch (error) {
        console.error('Error de red:', error);
      } 
    };

    getPosts();
  }, []);


    const [reto, setReto] = useState('Sube una foto panorámica de la vista más linda que encuentres desde la ventana de tu hogar.');  

    const scrollOffsetY = useRef(new Animated.Value(0)).current;

    const Header_Max_Height = 240;
    const Header_Min_Height = 70;
    const Scroll_Distance = Math.min(Header_Max_Height - Header_Min_Height, 500);

    const handleProfilePress = () => {
      console.log('Image pressed');
      console.log('Navegar al perfil');
      navigation.navigate('profile');
    }

    const handleLupaPress = () => {
      console.log('Lupa pressed');
      console.log('Navegar al buscador de perfiles');
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
                source={require('../assets/imagenUsuarioEjemplo.jpg')}
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

    const feedDataHardcode = [
      { imagenURL: require('../assets/imagenFeedComponentEjemplo.png'), perfil: 'santi', imagenPerfilURL: require('../assets/imagenUsuarioEjemplo.jpg') },
      { imagenURL: require('../assets/imagenFeedComponentEjemplo2.png'), perfil: 'rena', imagenPerfilURL: require('../assets/imagenUsuarioEjemplo2.jpg') }
    ];

    return (
      <SafeAreaView style={{backgroundColor: '#e5e5e5'}}>
        <DynamicHeader value={scrollOffsetY}/>
        <ScrollView
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={15}
          contentContainerStyle={{paddingBottom: 100}}
          onScroll={Animated.event([
            {nativeEvent: {contentOffset: {y: scrollOffsetY}}}
          ], {
            useNativeDriver: false,
          })}
        >
          {feedData.map((item, index) => (
            <FeedComponentWithActionSheet 
              key={index}
              imagenURL={item.imageURL}
              perfil={item.perfil}
              imagenPerfilURL={item.imagenPerfilURL}
            />
          ))}
        </ScrollView>
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