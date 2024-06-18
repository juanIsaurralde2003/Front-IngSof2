import React, { useEffect, useState } from 'react';
import { Keyboard, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View, RefreshControl } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SERVER } from '../utils/utils';
import { Entypo, EvilIcons, MaterialIcons } from '@expo/vector-icons';
import UserSearchComponent from '../components/UserSearchComponent';
import { useAuth } from '../components/AuthContext';
import FollowerComponent from './FollowerComponent';

const FollowersTab = ({fromScreen, usuario}) => {
   
  const navigation = useNavigation();

  const {token, user} = useAuth();

  const [inputValue, setInputValue] = useState('');
  const [followers, setFollowers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const getFollowers = async () => {
    setRefreshing(true); // Set refreshing to true when the data is being fetched

    const url = `${SERVER}/users/followerslist/${usuario}`;

    try {
      const response = await fetch(url, { method: 'GET',         
        headers: { 
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setFollowers(data);
        setRefreshing(false); // Set refreshing to false when the data fetching is complete
        console.log(data);
      } else {
        //console.error('Error al obtener followers');
        setRefreshing(false); // Set refreshing to false if there is an error fetching data
      }
    } catch (error) {
      //console.error('Error de red:', error);
      setRefreshing(false); // Set refreshing to false if there is an error fetching data
    } 
  };

  useEffect(() => {
    getFollowers();
  }, []);

  const filteredUsuarios = followers.filter(usuario =>
    usuario.username.toLowerCase().includes(inputValue.toLowerCase())
  );

  const handleRefresh = () => {
    getFollowers(); // Call the getFollowers function again when the ScrollView is pulled down to refresh
  };

  return (
    <SafeAreaView style={{backgroundColor: '#e5e5e5', flexGrow: 1}}>
      <View>
        <View style={styles.searchHeading}>
          <View style={styles.searchHeadingBar}>
            <TextInput
              value={inputValue}
              style={styles.searchBar}
              placeholder="Buscar usuarios ..."
              placeholderTextColor={'darkgray'}
              onChangeText={(text) => setInputValue(text)}
            />
          </View>
        </View>
        
        <ScrollView
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={15}
          contentContainerStyle={{height: '100%', paddingBottom: 100, flexGrow: 1, backgroundColor: '#e5e5e5', width: '100%'}}
          onTouchStart={Keyboard.dismiss}
          keyboardShouldPersistTaps='handled'
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
            />
          }
        >
          {followers.length === 0 ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 16, textAlign: 'center', color: 'gray', padding: 20 }}>
                Aún no tienes seguidores. Invita a tus amigos a unirse a la app.
              </Text>
            </View>
          ) : (
            filteredUsuarios.map((item, index) => (
              <FollowerComponent 
                key={index}
                perfil={item.username}
                imagenPerfilURL={item.profilePicture}
                fromScreen={fromScreen}
                follows={item.followsBack}
              />
          )))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  searchHeading: {
    flexDirection: 'row',
    height: 70,
    width: '100%',
    padding: 15,
    alignItems: 'center',
  },
  searchHeadingBar: {
    width: '100%',
    padding: 5,
    flexDirection: 'row',
    borderWidth: 1.5,
    borderRadius: 30,
    borderColor: 'black',
  },
  searchBar: {
    alignSelf: 'center',
    paddingHorizontal: 10,
    paddingVertical:5,
    fontFamily: 'Quicksand',
    fontSize: 14,
    width: '100%',
  },
  searchIcon: {
    justifyContent: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    width: '15%',
    padding: 5,
  },
});

export default FollowersTab;
