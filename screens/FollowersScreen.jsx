import React, { useState } from 'react';
import { SafeAreaView, TouchableOpacity, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../components/AuthContext';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import FollowersTab from '../components/FollowersTab';
import FollowingTab from '../components/FollowingTab';

const FollowersScreen = () => {
  
  const Tab = createMaterialTopTabNavigator();
  const navigation = useNavigation();

  const route = useRoute();
  const { fromScreen, fromAction, usuario } = route.params;
  const {token, user} = useAuth();

  const [inputValue, setInputValue] = useState('');
  const [followers, setFollowers] = useState([]);

  const handleClosePress = () => {
    navigation.navigate('profile', {
      fromScreen: fromScreen,
      userData: usuario, 
    });
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#e5e5e5' }}>
      <View style={{ paddingTop: 10, paddingBottom: 2, paddingHorizontal: 10}}>
        <TouchableOpacity onPress={handleClosePress}>
          <Ionicons name='chevron-back' size={25} color={'black'} />
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1, backgroundColor: '#e5e5e5' }}>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIndicatorStyle: { backgroundColor: '#390294' },
            tabBarStyle: { backgroundColor: '#e5e5e5' },
            tabBarLabelStyle: { fontSize: 15}
          })}
          initialRouteName={fromAction === 'Followers' ? 'Seguidores' : 'Seguidos'}
        >
          <Tab.Screen name="Seguidores">
            {() => <FollowersTab usuario={usuario} fromScreen={fromScreen}/>}
          </Tab.Screen>
          <Tab.Screen name="Seguidos">
            {() => <FollowingTab usuario={usuario} fromScreen={fromScreen} />}
          </Tab.Screen>
        </Tab.Navigator>
      </View>
    </SafeAreaView>
  );
};

export default FollowersScreen;