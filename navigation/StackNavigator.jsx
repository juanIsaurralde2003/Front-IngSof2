import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';

const Stack = createNativeStackNavigator();

const StackNavigator = () => (
    <Stack.Navigator>
        <Stack.Screen
            options={{ 
                headerShown: false,
            }} 
            name="login" component={LoginScreen} 
        />
  </Stack.Navigator>
);

export default StackNavigator;
