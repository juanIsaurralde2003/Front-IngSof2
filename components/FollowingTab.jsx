import React, { useEffect, useState } from 'react';
import { Keyboard, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SERVER } from '../utils/utils';
import FollowerComponent from './FollowerComponent';
import { useAuth } from '../components/AuthContext';

const FollowingTab = ({ fromScreen, usuario }) => {
  const navigation = useNavigation();
  const { token, user } = useAuth();

  const [inputValue, setInputValue] = useState('');
  const [following, setFollowing] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const getFollowing = async () => {
    setRefreshing(true); // Set refreshing to true when the data is being fetched

    const url = `${SERVER}/users/followinglist/${usuario}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFollowing(data);
        setRefreshing(false); // Set refreshing to false when the data fetching is complete
        console.log(data);
      } else {
        //console.error('Error al obtener following');
        setRefreshing(false); // Set refreshing to false if there is an error fetching data
      }
    } catch (error) {
      //console.error('Error de red:', error);
      setRefreshing(false); // Set refreshing to false if there is an error fetching data
    }
  };

  useEffect(() => {
    getFollowing();
  }, []);

  const filteredUsuarios = following.filter((usuario) =>
    usuario.username.toLowerCase().includes(inputValue.toLowerCase())
  );

  const handleRefresh = () => {
    getFollowing(); // Call the getFollowing function again when the ScrollView is pulled down to refresh
  };

  return (
    <SafeAreaView style={{ backgroundColor: '#e5e5e5', flexGrow: 1 }}>
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
          contentContainerStyle={{ height: '100%', paddingBottom: 100, flexGrow: 1, backgroundColor: '#e5e5e5', width: '100%' }}
          onTouchStart={Keyboard.dismiss}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          {following.length === 0 ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 16, textAlign: 'center', color: 'gray', padding: 20 }}>
                No sigues a ningún usuario.
              </Text>
            </View>
          ) : (
            filteredUsuarios.map((item, index) => (
              <FollowerComponent
                key={index}
                perfil={item.username}
                imagenPerfilURL={item.profilePicture}
                fromScreen={fromScreen}
                follows={true}
              />
            ))
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
    paddingVertical: 5,
    fontFamily: 'Quicksand',
    fontSize: 14,
    width: '100%',
  },
});

export default FollowingTab;
