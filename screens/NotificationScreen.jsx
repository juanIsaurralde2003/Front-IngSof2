import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet,TouchableOpacity, SafeAreaView } from 'react-native';
import { Entypo, EvilIcons, MaterialIcons } from '@expo/vector-icons';
import { useRoute } from "@react-navigation/native";
import { useNavigation } from '@react-navigation/native';

// Ejemplo de datos de notificaciones
const notificationsHC = [
  { id: '1', type: 'challenge', message: 'El reto de hoy es: Completar 10,000 pasos.' },
  { id: '2', type: 'follow', message: 'El usuario @juan ha comenzado a seguirte.' },
  { id: '3', type: 'challenge', message: 'El reto de hoy es: Leer 30 minutos.' },
  { id: '4', type: 'follow', message: 'El usuario @maria ha comenzado a seguirte.' },
];


const NotificationScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const {fromScreen, notifications} = route.params;
    
    const handleClosePress = () => {
        navigation.navigate(fromScreen);
    }

    useEffect(()=>{
        console.log("NotificationScreen: vengo de: " + fromScreen);
    },[])
    const renderNotification = ({ item }) => (
        <View style={styles.notification}>
            <Text style={styles.type}>{item.type === 'challenge' ? 'Reto del día' : 'Nuevo seguidor'}</Text>
            <Text style={styles.message}>{item.message}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={handleClosePress} style={styles.button}>
                    <MaterialIcons name={'close'} size={30} color={'black'} />
                </TouchableOpacity>
                <Text style={styles.header}>Notifications</Text>
            </View>
            <FlatList
                data={notificationsHC}
                keyExtractor={(item) => item.id}
                renderItem={renderNotification}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  headerContainer:{
    'flexDirection':'row'
  },
  button:{
    margin:20
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    alignSelf:'center',
  },
  notification: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  type: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  message: {
    fontSize: 16,
    marginTop: 5,
  },
});

export default NotificationScreen;
