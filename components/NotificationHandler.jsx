import { useEffect } from 'react';
import { useNavigation} from '@react-navigation/native';
import { useAuth } from './AuthContext';
import { registerForPushNotificationsAsync, registerNotificationHandlers, unregisterNotificationHandlers } from '../services/NotificationService';
import { SERVER } from '../utils/utils';

const NotificationHandler = () => {
    const navigation = useNavigation();
    const { user,token,dailyPost} = useAuth();

    useEffect(() => {
        let unsubscribeNotifications;
        console.log("hay post diario? Notification Handler: " + dailyPost)
        console.log("navigation?: " + navigation)
        console.log("user?: " + user)
        if (user && navigation && token) {
            console.log("hay post diario 2? Notification Handler: " + dailyPost)
            registerForPushNotificationsAsync(user,token);
            unsubscribeNotifications = registerNotificationHandlers(navigation,dailyPost);
        }
        else if(!user && unsubscribeNotifications){
            unsubscribeNotifications();
        }
    }, [navigation, user, dailyPost]);

    return null;
};

export default NotificationHandler;
