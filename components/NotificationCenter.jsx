import React, {useState,useEffect,useCallback} from 'react';
import { StyleSheet, View,TouchableOpacity,Text } from 'react-native';
import { MaterialCommunityIcons} from '@expo/vector-icons';
import { SERVER } from '../utils/utils';
import io from 'socket.io-client'
import {useAuth} from './AuthContext'
import { useFocusEffect } from '@react-navigation/native';
import StyledText from './StyledText';

export const NotificationCenter = ({fromScreen, navigation}) => {
    
    const [unreadCount,setUnreadCount] = useState(0);
    const {token,user} = useAuth();


    useEffect(()=>{
        const socket = io(SERVER, {
            query: {
                username: user,
            }
        });
        socket.on('connect',()=>{
            console.log('Conexion exitosa');
        });
        socket.on('notification',()=>{
            console.log("NotificationCenter: entre a sendNotification");
            setUnreadCount((prev)=>(prev+1));
            
        });
        socket.on('disconnect',()=>{
            console.log('Conexion finalizada');
        })

        return()=>{
            socket.disconnect();
        }

    },[]);

    const getUnreadNotifications = async ()=>{
        try{
            const url = `${SERVER}/notifications/unread/${encodeURIComponent(user)}`
            const response = await fetch(url,{
                method:'GET',
                headers:{
                    'Authorization':`Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });
            if(response.status === 200){
                console.log("NotificationCenter:Se recibieron bien uncount nots");
                const data  = await response.json();
                console.log(data.data.low)
                setUnreadCount(data.data.low);
            }
            else{
                console.error("NotificationCenter:Hubo un errror con la solicitud para obtener unread nots",response.status);
            }
        } catch(error){
            console.error("NotificationCenter:Hubo un error obteniendo unread nots",error)
        }
    }

    useFocusEffect(
        useCallback(() => {
            getUnreadNotifications();
        }, [])
    );


    const handleNotificationPress = () => {
        setUnreadCount(0);
        navigation.navigate('notifications',{
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