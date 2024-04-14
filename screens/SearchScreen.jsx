import React, { useEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SERVER } from '../utils/utils';

const SearchScreen = () => {
   
  const navigation = useNavigation();

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

  const handleLupaPress = () => {
    console.log('Lupa pressed');
    console.log('Navegar al buscador de perfiles');
  }

    return (
      <SafeAreaView style={{backgroundColor: '#e5e5e5'}}>
        
        <ScrollView
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={15}
          contentContainerStyle={{paddingBottom: 100}}
        >
          <Text>BUSCAR</Text>
          <Text>BUSCAR</Text>
          <Text>BUSCAR</Text>
          <Text>BUSCAR</Text>
          <Text>BUSCAR</Text>
        </ScrollView>
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  
});

export default SearchScreen;