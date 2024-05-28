import { useEffect,useRef } from 'react';
import { useNavigation} from '@react-navigation/native';
import { useAuth } from './AuthContext';
import { registerForPushNotificationsAsync, registerNotificationHandlers} from '../services/NotificationService';

const NotificationHandler = () => {
    const navigation = useNavigation();
    const { user,token,dailyPost} = useAuth();
    const unsubscribeRef = useRef();

    handleRegisterNotifications = async () => {
        if(user && navigation && token){
            await registerForPushNotificationsAsync(user,token);
            unsubscribeRef.current = await registerNotificationHandlers(navigation, dailyPost);
        }
    }

    useEffect(() => {
        handleRegisterNotifications();
        return () => {
            if (unsubscribeRef.current) {
                unsubscribeRef.current();
                console.log("NotificationHandler: listeners removidos correctamente");
            }
        };
    }, [navigation, user, dailyPost]);

    useEffect(() => {
        if (!user) {
            if (unsubscribeRef.current) {
                unsubscribeRef.current();
                console.log("NotificationHandler: listeners removidos correctamente");
            }
        }
    }, [user]);
    return null;
};

export default NotificationHandler;
