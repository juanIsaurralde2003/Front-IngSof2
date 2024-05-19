import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './StackNavigator';
import NotificationHandler from '../components/NotificationHandler';
import { useAuth } from '../components/AuthContext';
import { SessionExpired } from '../components/SessionExpired';


const AppNavigationContainer = () => (
  <NavigationContainer>
    <NotificationHandler/>
    <SessionExpired/>
    <StackNavigator/>
  </NavigationContainer>
);

export default AppNavigationContainer;
