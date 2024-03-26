import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import ChallengeScreen from '../screens/ChallengeScreen';

const Stack = createNativeStackNavigator();

const StackNavigator = () => (
    <Stack.Navigator>
        <Stack.Screen
            options={{ 
                headerShown: false,
            }} 
            name="login" component={LoginScreen} 
        />
        <Stack.Screen options={{  headerShown: false }}  name="challenge" component={ChallengeScreen} />
  </Stack.Navigator>
);

export default StackNavigator;
