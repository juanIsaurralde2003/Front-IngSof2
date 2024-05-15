import { useEffect } from 'react';
import { useNavigation} from '@react-navigation/native';
import { useAuth } from './AuthContext';
import { registerForPushNotificationsAsync, registerNotificationHandlers, unregisterNotificationHandlers } from '../services/NotificationService';

const NotificationHandler = () => {
    const navigation = useNavigation();
    const { user,dailyPost} = useAuth();

    useEffect(() => {
        let unsubscribeNotifications;
        console.log("hay post diario?: " + dailyPost)
        console.log("navigation?: " + navigation)
        console.log("user?: " + user)
        if (user && navigation && dailyPost) {
            console.log("hay post diario? 2: " + dailyPost)
            registerForPushNotificationsAsync(user);
            unsubscribeNotifications = registerNotificationHandlers(navigation,dailyPost);
        }
        else if(!user && unsubscribeNotifications){
            unsubscribeNotifications();
        }
    }, [navigation, user, dailyPost]);

    return null;
};

export default NotificationHandler;
