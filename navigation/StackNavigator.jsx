import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import InitScreen from '../screens/InitScreen';
import LoginScreen from '../screens/LoginScreen';
import ChallengeScreen from '../screens/ChallengeScreen';
import CameraScreen from '../screens/CameraScreen';
import ProfileScreen from '../screens/ProfileScreen';
import FeedScreen from '../screens/FeedScreen';
import SignupScreen from '../screens/SignupScreen';
import SearchScreen from '../screens/SearchScreen';
import FollowersScreen from '../screens/FollowersScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import NotificationScreen from '../screens/NotificationScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';


const Stack = createNativeStackNavigator();

const StackNavigator = () => (
    <Stack.Navigator initialRouteName="init">
        <Stack.Screen options={{ headerShown: false, gestureEnabled: false,}} name="init" component={InitScreen}/>
        <Stack.Screen options={{ headerShown: false, gestureEnabled: false,}} name="login" component={LoginScreen} />
        <Stack.Screen options={{  headerShown: false, gestureEnabled: false }}  name="signup" component={SignupScreen} />
        <Stack.Screen options={{  headerShown: false, gestureEnabled: false }}  name="challenge" component={ChallengeScreen} />
        <Stack.Screen options={{  headerShown: false, animation:'slide_from_bottom', gestureEnabled: false }}  name="profile" component={ProfileScreen}/>
        <Stack.Screen options={{  headerShown: false, gestureEnabled: false }}  name="camera" component={CameraScreen}  />
        <Stack.Screen options={{  headerShown: false, gestureEnabled: false }}  name="feed" component={FeedScreen}  />
        <Stack.Screen options={{  headerShown: false, gestureEnabled: false }}  name="search" component={SearchScreen}  />
        <Stack.Screen options={{  headerShown: false }}  name="followers" component={FollowersScreen}  />
        <Stack.Screen options={{  headerShown: false }}  name="EditProfile" component={EditProfileScreen}  />
        <Stack.Screen options={{  headerShown: false }}  name="notifications" component={NotificationScreen}  />
        <Stack.Screen options={{  headerShown: false, gestureEnabled: false }}  name="changepassword" component={ChangePasswordScreen}  />
    </Stack.Navigator>
);

export default StackNavigator;
