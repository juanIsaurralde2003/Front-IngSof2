import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SERVER } from '../utils/utils';
import { Entypo } from '@expo/vector-icons';

const SearchScreen = () => {
   
  const navigation = useNavigation();

  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    
    const getUsers = async () => {

      const url = `${SERVER}/users`;

      try {
        const response = await fetch(url, { method: 'GET' });

        if (response.ok) {
          const data = await response.json();
    
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
    navigation.navigate('feed');
  }

    return (
      <SafeAreaView style={{backgroundColor: '#e5e5e5', flex: 1}}>
        <View style={{flex: 1}}>
        
          <View style={styles.searchHeading}>
            <View style={styles.searchHeadingBar}>
              <TextInput
                value={inputValue}
                style={styles.searchBar}
              />
            </View>
            <View style={styles.searchHeadingCross}>
              <TouchableOpacity onPress={handleClosePress} >
                <Entypo name='cross' size={30} color={'black'}/>
              </TouchableOpacity>
            </View>
          </View>
          
          <ScrollView
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={15}
            contentContainerStyle={{paddingBottom: 100, flex: 1}}
          >
            <Text>BUSCAR</Text>
            <Text>BUSCAR</Text>
            <Text>BUSCAR</Text>
            <Text>BUSCAR</Text>
            <Text>BUSCAR</Text>
          </ScrollView>
        </View>
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  searchHeading: {
    flex: 1,
    flexDirection: 'row',
    height: 70,
    width: '100%',
    padding: 15,
    backgroundColor: 'red',
  },
  searchHeadingBar: {
    width: '85%',
    backgroundColor: 'green',
  },
  searchHeadingCross: {
    width: '15%',
    height: 30,
  },
  searchBar: {
    borderWidth: 1,
    borderColor: 'black'
  },


});

export default SearchScreen;