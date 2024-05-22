import { useEffect } from 'react';
import { useNavigation} from '@react-navigation/native';
import { useAuth } from './AuthContext';
import { registerForPushNotificationsAsync, registerNotificationHandlers} from '../services/NotificationService';

const NotificationHandler = () => {
    const navigation = useNavigation();
    const { user,token,dailyPost} = useAuth();

    handleRegisterNotifications = async () => {
        if(user && navigation && token){
            await registerForPushNotificationsAsync(user,token);
            const unsubscribe = registerNotificationHandlers(navigation, dailyPost);
        }
    }

    useEffect(() => {
        handleRegisterNotifications();
    }, [navigation, user, dailyPost]);

    useEffect(()=>{
        if(!user){
        }
    },[user]);

    return null;
};

export default NotificationHandler;
