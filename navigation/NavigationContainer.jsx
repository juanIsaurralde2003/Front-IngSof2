import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './StackNavigator';


const AppNavigationContainer = () => (
  <NavigationContainer>
    <StackNavigator/>
  </NavigationContainer>
);

export default AppNavigationContainer;
