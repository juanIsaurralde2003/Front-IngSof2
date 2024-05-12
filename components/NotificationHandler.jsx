import { registerForPushNotificationsAsync, registerNotificationHandlers } from '../services/NotificationService';
import { StyleSheet, Text, View } from 'react-native';
import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
7


const NotificationHandler = () => {
    const navigation = useNavigation();
    useEffect(() => {
        registerForPushNotificationsAsync();
        registerNotificationHandlers(navigation);
      }, []);

}

export default NotificationHandler;