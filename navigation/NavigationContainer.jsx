import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './StackNavigator';
import NotificationHandler from '../components/NotificationHandler';
import { useAuth } from '../components/AuthContext';


const AppNavigationContainer = () => (
  <NavigationContainer>
    <NotificationHandler/>
    <StackNavigator/>
  </NavigationContainer>
);

export default AppNavigationContainer;
