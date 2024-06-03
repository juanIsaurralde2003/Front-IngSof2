import React, {useState,useEffect} from 'react';
import { StyleSheet, View,TouchableOpacity,Text } from 'react-native';
import { MaterialCommunityIcons} from '@expo/vector-icons';
import { SERVER } from '../utils/utils';
import io from 'socket.io-client'
import {useAuth} from './AuthContext'
import { err } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';

export const NotificationCenter = ({fromScreen, navigation}) => {

    const [notifications,setNotifications] = useState([]);
    const [unreadCount,setUnreadCount] = useState(10);
    const socket = io(`${SERVER}/algo`);
    const {token} = useAuth();


    useEffect(()=>{

        socket.on('connect',()=>{
            console.log('Conexion exitosa');
        });
        socket.on('notification',(data)=>{
            const newNotification = data;
            setNotifications((prev)=>([...prev,newNotification]))
            setUnreadCount((prev)=>(prev+1))
            
        });
        socket.on('disconnect',()=>{
            console.log('Conexion finalizada');
        })

        return()=>{
            socket.disconnect();
        }

    },[])

    const getNotifications = async () => {
        try{
            const url = `${SERVER}/notifications`;
            const response = await fetch(url,{
                method:'GET',
                headers:{
                    'Authentication':`Bearer ${token}`
                }
            })
            if(response.status === '200'){
                const data = await response.json();
                setNotifications(data);
                const unread = notifications.filter((notification)=>(!notification.read)).length;
                setUnreadCount(unread);
            }
            else{
                console.error("NotificationCenter: Hubo un error con la solicitud",response.status);
            }
        } catch(error){
            console.error('NotificationCenter: Error obteniendo notificaciones',error);
        }
    }

    useEffect(()=>{
        getNotifications();
    },[]);

    const markAllAsRead = () => {
        try{
            const updatedNotifications = notifications.map((notification) => (notification.read = true));
            setNotifications(updatedNotifications);
            setUnreadCount(0);
        }catch(error){
            console.error("NotificationCenter:Error leyendo notificaciones",error);
        }
    }


    const handleNotificationPress = () => {
        markAllAsRead();
        navigation.navigate('notifications',{
            notifications:notifications,
            fromScreen:fromScreen
        });

    };
    
    const parseThousends = (unreadCount)=>{
        if (unreadCount>=1000){
            return (Math.floor(unreadCount/100))/10  +  'k';
        }
        else{
            return unreadCount;
        }
    };


    return(
    <View style={styles.container}>
        <TouchableOpacity onPress={handleNotificationPress} style={styles.button}>
            <MaterialCommunityIcons name='bell-outline' size={35} color={'black'} style={styles.icon}/>
            {unreadCount > 0 && (
                <View style={unreadCount > 9 ? [styles.badge,{padding:1.5}] : [styles.badge,{ width: 15,height: 15,}]}>
                    <Text style={styles.badgeText}>{parseThousends(unreadCount)}</Text>
                </View>
            )}
        </TouchableOpacity>
    </View>
    )
}

const styles = StyleSheet.create({
    container:{},
    button:{},
    icon:{
        marginRight:15
    },
    badge: {
        position: 'absolute',
        right: 15,
        top: 0,
        backgroundColor: 'red',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
      },
      badgeText: {
        color: 'white',
        fontSize: 12,
      }
})