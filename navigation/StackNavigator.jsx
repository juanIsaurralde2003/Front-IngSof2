import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import ChallengeScreen from '../screens/ChallengeScreen';
import CameraScreen from '../screens/CameraScreen';

const Stack = createNativeStackNavigator();

const StackNavigator = () => (
    <Stack.Navigator>
        <Stack.Screen
            options={{ 
                headerShown: false,
            }} 
            name="login" component={LoginScreen} 
            //name="camera" component={CameraScreen} 
            // lo deje para probar la pantalla de la camara
        />
        <Stack.Screen options={{  headerShown: false }}  name="challenge" component={ChallengeScreen} />
  </Stack.Navigator>
);

export default StackNavigator;
