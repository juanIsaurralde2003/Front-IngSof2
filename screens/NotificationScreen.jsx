import React, { useEffect,useState } from 'react';
import { View, Text, FlatList, StyleSheet,TouchableOpacity, SafeAreaView,Image } from 'react-native';
import { Entypo, EvilIcons, MaterialIcons } from '@expo/vector-icons';
import { useRoute } from "@react-navigation/native";
import { useNavigation } from '@react-navigation/native';
import { SERVER } from '../utils/utils';
import { useAuth } from '../components/AuthContext';

// Ejemplo de datos de notificaciones


const NotificationScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const [notifications,setNotifications] = useState([]);
    const {fromScreen} = route.params;
    const {user,token} = useAuth();
    const months = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Setiembre","Octubre","Noviembre","Diciembre"];
    
    const handleClosePress = () => {
        navigation.navigate(fromScreen);
    }

    const getNotifications = async () => {
      try{
          const url = `${SERVER}/notifications/${encodeURIComponent(user)}`;
          const response = await fetch(url,{
              method:'GET',
              headers:{
                  'Authorization':`Bearer ${token}`,
                  'Content-Type': 'application/json'
              }
          })
          if(response.status === 200){
              const data = await response.json();
              console.log("NotificationScreen: las notificaciones que llegaron son: "+ JSON.stringify(data.data));
              setNotifications(data.data);
              markAllAsRead(data.data);
          }
          else{
              console.error("NotificationScreen: Hubo un error con la solicitud",response.status);
          }
      } catch(error){
          console.error('NotificationScreen: Error obteniendo notificaciones',error);
      }
    }

    const markAllAsRead = async (notifications) => {
      try{
          const url = `${SERVER}/notifications/mark-as-read`
          const ids =notifications.map((notification)=>(notification.id))
          console.log(ids);
          console.log("NotificationScreen: los ids son: "+ JSON.stringify(ids))
          const response = await fetch(url,{
              method:'PUT',
              headers:{
                  'Authorization':`Bearer ${token}`,
                  'Content-Type': 'application/json'
              },
              body:JSON.stringify(ids)
          })
          if(response.status === 200){
              const updatedNotifications = notifications.map((notification) => ({ ...notification, read: true }));
              setNotifications(updatedNotifications);
              console.log("NotificationScreen: Estados de not actualizados correctamente")
          }
          else{
              console.error('NotificationScreen: Hubo un error con la solicitud', response.status)
          }
      
      }catch(error){
          console.error("NotificationScreen: Error actualizando estado",error);
      }
  }

    function takeUntilSpace(str) {
        let index = str.indexOf(' ');
        if (index === -1) return str; // Si no hay espacio, retorna el string completo
        return str.substring(0, index);
    }

    function takeFromSpace(str) {
        let index = str.indexOf(' ');
        if (index === -1) return ''; // Si no hay espacio, retorna una cadena vacía
        return str.substring(index + 1);
    }

    const getTimeDifference = (epochTime) => {
      const currentTime = Math.floor(Date.now()/1000); // Obtener la fecha y hora actual en epoch (segundos)
      console.log(currentTime);
      console.log(epochTime);
      console.log(currentTime - epochTime)
      const differenceInSeconds = currentTime - epochTime; // Calcular la diferencia en segundos
  
      if (differenceInSeconds < 60) {
        const seconds = Math.floor(differenceInSeconds);
        return `${seconds}s`; // Segundos
      } 
      else if (differenceInSeconds < 3600) {
        const minutes = Math.floor(differenceInSeconds / 60);
        return `${minutes}m`; // Minutos
      } 
      else if (differenceInSeconds < 86400) {
        const hours = Math.floor(differenceInSeconds / 3600);
        return `${hours}h`; // Horas
      } 
      else if (differenceInSeconds < 2592000) { // Aproximadamente 30 días
        const days = Math.floor(differenceInSeconds / 86400);
        return `${days}d`; // Días
      } 
      else {
        const months = Math.floor(differenceInSeconds / 2592000);
        return `${months}m`; // Meses
      }
    };


    useEffect(()=>{
        console.log("NotificationScreen: vengo de: " + fromScreen);
        getNotifications();
    },[]);

    const renderNotification = ({ item }) => (
        <View style={styles.notification}>
          <View style={{flexDirection:'row'}}>
            <Image style = {styles.profilePicture} source={{uri: item.profilePicture}}/>
            <View style={styles.messageContainer}>
              <Text style={styles.message}><Text style={{fontWeight:'bold'}}>{takeUntilSpace(item.message) + " "}</Text>
                {takeFromSpace(item.message)} 
                <Text style={styles.date}> {getTimeDifference(item.date/1000)}</Text>
              </Text>
            </View>
          </View>
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
                data={notifications}
                keyExtractor={(item) => item.id}
                renderItem={renderNotification}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding:20,
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
  messageContainer:{
    marginTop: 5,
  },
  message: {
    fontSize: 14,
  },
  date:{
    position:'absolute',
    top:5,
    right:40,
    fontSize: 14,
    color: '#656262',
    lineHeight: 16,
    fontWeight:'300'
  },
  time:{
    position:'absolute',
    top:5,
    right:5,
    fontSize: 14,
    color: '#656262',
    lineHeight: 16,
    fontWeight:'300'
  },
  profilePicture:{
    borderRadius:100,
    height:45,
    width:45,
    marginRight:15
  }
});

export default NotificationScreen;
