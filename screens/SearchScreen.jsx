import React, { useEffect, useRef, useState } from 'react';
import { Keyboard, SafeAreaView, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SERVER } from '../utils/utils';
import { Entypo, MaterialIcons } from '@expo/vector-icons';
import UserSearchComponent from '../components/UserSearchComponent';
import { useAuth } from '../components/AuthContext';

const SearchScreen = () => {
   
  const navigation = useNavigation();

  const route = useRoute();
  const { fromScreen } = route.params;
  const {token} = useAuth();

  const [inputValue, setInputValue] = useState('');
  const [usuarios, setUsuarios] = useState([]);
  const debounceTimeout = useRef(null);

  const getUsers = async (text) => {

    console.log(text);

    const url = `${SERVER}/search/${text}`;

    try {
      const response = await fetch(url, { method: 'GET',         
        headers: { 
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUsuarios(data.users);
  
        console.log(data);
      } else {
        ////console.error('Error al obtener usuarios');
      }
    } catch (error) {
      ////console.error('Error de red:', error);
    } 
  };

  const handleInputChange = (text) => {
    setInputValue(text);
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      getUsers(text);
    }, 1000);
  };

  const handleClosePress = () => {
    console.log('Lupa pressed');
    console.log('Navegar al feed');
    navigation.navigate(fromScreen);
  }

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
              onChangeText={(text) => handleInputChange(text)}
            />
            {inputValue === '' && (
              <View style={styles.searchIcon}>
                <Entypo name='magnifying-glass' size={18} color={'darkgray'} />
              </View>
            )}
          </View>
          <View style={styles.searchHeadingCross}>
            <TouchableOpacity onPress={handleClosePress} >
              <MaterialIcons name={'close'} size={30} color={'black'} />
            </TouchableOpacity>
          </View>
        </View>
        
        <ScrollView
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={15}
          contentContainerStyle={{paddingBottom: 100, flexGrow: 1, backgroundColor: '#e5e5e5', width: '100%'}}
          onTouchStart={Keyboard.dismiss}
          keyboardShouldPersistTaps='handled'
        >
          {inputValue !== '' && usuarios.map((item, index) => (
            <UserSearchComponent 
              key={index}
              perfil={item.username}
              imagenPerfilURL={item.profilePicture}
              fromScreen={fromScreen}
            />
          ))}
          {inputValue === '' && (
            <View>
              <Text>Busca a nuevos seguidores!</Text>
            </View> 
          )}
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
    width: '85%',
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
    paddingVertical:13,
    fontSize: 14,
    fontFamily: 'Quicksand',
    height: 40,
    width: '85%',
  },
  searchIcon: {
    justifyContent: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    width: '15%',
    padding: 5,
  },
});

export default SearchScreen;