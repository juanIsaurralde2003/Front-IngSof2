import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import ChallengeScreen from '../screens/ChallengeScreen';
import CameraScreen from '../screens/CameraScreen';
import FeedScreen from '../screens/FeedScreen';
import SignupScreen from '../screens/SignupScreen';

const Stack = createNativeStackNavigator();

const StackNavigator = () => (
    <Stack.Navigator>
        <Stack.Screen
            options={{ 
                headerShown: false,
            }} 
            name="login" component={LoginScreen} 
            // lo deje para probar la pantalla de la camara
        />
        <Stack.Screen options={{  headerShown: false }}  name="signup" component={SignupScreen} />
        <Stack.Screen options={{  headerShown: false }}  name="challenge" component={ChallengeScreen} />
        <Stack.Screen options={{  headerShown: false }}  name="camera" component={CameraScreen}  />
        <Stack.Screen options={{  headerShown: false }}  name="feed" component={FeedScreen}  />
  </Stack.Navigator>
);

export default StackNavigator;
