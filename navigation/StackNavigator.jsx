import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import ChallengeScreen from '../screens/ChallengeScreen';
import CameraScreen from '../screens/CameraScreen';
import ProfileScreen from '../screens/ProfileScreen';
import FeedScreen from '../screens/FeedScreen';


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
    
        <Stack.Screen options={{  headerShown: false }}  name="challenge" component={ChallengeScreen} />
        <Stack.Screen options={{  headerShown: false, animation:'slide_from_bottom' }}  name="profile" component={ProfileScreen}/>
        <Stack.Screen options={{  headerShown: false }}  name="camera" component={CameraScreen}  />
        <Stack.Screen options={{  headerShown: false }}  name="feed" component={FeedScreen}  />
  </Stack.Navigator>
);

export default StackNavigator;
