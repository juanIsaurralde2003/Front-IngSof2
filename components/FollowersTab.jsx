import React, { useEffect, useState } from 'react';
import { Keyboard, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SERVER } from '../utils/utils';
import { Entypo, EvilIcons, MaterialIcons } from '@expo/vector-icons';
import UserSearchComponent from '../components/UserSearchComponent';
import { useAuth } from '../components/AuthContext';
import FollowerComponent from './FollowerComponent';

const FollowersTab = ({fromScreen}) => {
   
  const navigation = useNavigation();

  const {token, user} = useAuth();

  const [inputValue, setInputValue] = useState('');
  const [followers, setFollowers] = useState([]);

  useEffect(() => {
    const getFollowers = async () => {

      const url = `${SERVER}/users/followerslist/${user}`;

      try {
        const response = await fetch(url, { method: 'GET',         
          headers: { 
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setFollowers(data);
    
          console.log(data);
        } else {
          console.error('Error al obtener followers');
        }
      } catch (error) {
        console.error('Error de red:', error);
      } 
    };

    getFollowers();
  }, []);

  const filteredUsuarios = followers.filter(usuario =>
    usuario.username.toLowerCase().includes(inputValue.toLowerCase())
  );

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
          contentContainerStyle={{paddingBottom: 100, flexGrow: 1, backgroundColor: '#e5e5e5', width: '100%'}}
          onTouchStart={Keyboard.dismiss}
          keyboardShouldPersistTaps='handled'
        >
          {filteredUsuarios.map((item, index) => (
            <FollowerComponent 
              key={index}
              perfil={item.username}
              imagenPerfilURL={item.profilePicture}
              fromScreen={fromScreen}
              follows={false}
            />
          ))}
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
  searchHeadingCross: {
    width: '15%',
    flexDirection: 'column',
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBar: {
    alignSelf: 'center',
    paddingHorizontal: 10,
    paddingVertical:5,
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