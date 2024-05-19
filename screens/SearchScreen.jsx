import React, { useEffect, useState } from 'react';
import { Keyboard, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SERVER } from '../utils/utils';
import { Entypo, EvilIcons, MaterialIcons } from '@expo/vector-icons';
import UserSearchComponent from '../components/UserSearchComponent';

const SearchScreen = () => {
   
  const navigation = useNavigation();

  const route = useRoute();
  const { fromScreen } = route.params;

  const [inputValue, setInputValue] = useState('');
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    const getUsers = async () => {

      const url = `${SERVER}/users`;

      try {
        const response = await fetch(url, { method: 'GET' });

        if (response.ok) {
          const data = await response.json();
          setUsuarios(data.users);
    
          console.log(data);
        } else {
          console.error('Error al obtener usuarios');
        }
      } catch (error) {
        console.error('Error de red:', error);
      } 
    };

    getUsers();
  }, []);

  const handleClosePress = () => {
    console.log('Lupa pressed');
    console.log('Navegar al feed');
    navigation.navigate(fromScreen);
  }

  const filteredUsuarios = usuarios.filter(usuario =>
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
            {inputValue === '' && (
              <View style={styles.searchIcon}>
                <Entypo name='magnifying-glass' size={24} color={'darkgray'} />
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
          {filteredUsuarios.map((item, index) => (
            <UserSearchComponent 
              key={index}
              perfil={item.username}
              imagenPerfilURL={item.profilePicture}
              fromScreen={fromScreen}
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
    height: 40,
    alignSelf: 'center',
    paddingHorizontal: 10,
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