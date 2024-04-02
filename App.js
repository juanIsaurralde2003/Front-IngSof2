import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import LoginScreen from './screens/LoginScreen'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AppNavigationContainer from './navigation/NavigationContainer';
import { useFonts } from 'expo-font';


const Stack = createNativeStackNavigator();
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import FeedComponent from './components/FeedComponent';

export default function App() {
  const [fontsLoaded] = useFonts({
    Quicksand: require('./assets/fonts/Quicksand-VariableFont_wght.ttf'), 
  });
  if (!fontsLoaded) {
    return null;
  }
  return (
      <AppNavigationContainer/>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
