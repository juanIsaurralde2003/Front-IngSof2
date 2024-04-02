import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import LoginScreen from './screens/LoginScreen'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AppNavigationContainer from './navigation/NavigationContainer';
import { AuthProvider } from './components/AuthContext';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <AppNavigationContainer/>
    </AuthProvider>  
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
