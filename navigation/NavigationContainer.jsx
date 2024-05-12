import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './StackNavigator';
import NotificationHandler from '../components/NotificationHandler';


const AppNavigationContainer = () => (
  <NavigationContainer>
    <NotificationHandler/>
    <StackNavigator/>
  </NavigationContainer>
);

export default AppNavigationContainer;
