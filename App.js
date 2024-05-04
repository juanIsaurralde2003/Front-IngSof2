import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import LoginScreen from './screens/LoginScreen'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AppNavigationContainer from './navigation/NavigationContainer';
import { AuthProvider } from './components/AuthContext';
import { useFonts } from 'expo-font';
import { SafeAreaView } from 'react-native-safe-area-context';



const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    'Quicksand': require('./assets/fonts/Quicksand-VariableFont_wght.ttf'),
    'Quicksand-Bold':require('./assets/fonts/Quicksand-Bold.ttf'),
    'Quicksand-bold':require('./assets/fonts/Quicksand-Bold.ttf'),
    'Noto-Sans': require('./assets/fonts/Noto_Sans/NotoSans-VariableFont_wdth,wght.ttf'),
    'Roboto': require('./assets/fonts/Roboto/Roboto-Bold.ttf')
     
  });
  if (!fontsLoaded) {
    return null;
  }
  return (
    <SafeAreaView style={{flex: 1}}>
    <AuthProvider>
      <AppNavigationContainer/>
    </AuthProvider>
    </SafeAreaView>  
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
