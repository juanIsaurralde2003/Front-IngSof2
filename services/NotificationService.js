import * as Notifications from 'expo-notifications';
import { SERVER } from '../utils/utils';
import * as NotificationHandlers from './NotificationReceivedHandler.js'
import * as NotificationHandlerResponse from './NotificationReceivedHandlerResponse.js'


Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }), 
});

export async function registerForPushNotificationsAsync() {
    try {
        let token;
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            if (status !== 'granted') {
                alert('Error para obtener push token para push notifications');
                return;
            }
        }
        const expoToken = (await Notifications.getExpoPushTokenAsync({
            projectId: 'a7e92cd2-f7c6-4810-9f88-891023c4b37b'
        })).data;
        const data = JSON.stringify({
            token: expoToken,
            username:"TestUser"
        });
        console.log(data);
        const url = `${SERVER}/notifications/register-token`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: data
        });
        if(response.status === 200){
            console.log("token registrado correctamente");
        }
        else{
            console.error("Hubo un error con la solicitud: ",response.status);
        }
        
    } catch (error) {
        console.error("Se produjo un error durante el registro de notificaciones push:  ", error);
    }
}

export const registerNotificationHandlers = (navigation,dailyPost) => {
    if(navigation && dailyPost){
        console.log("aaaa " + navigation)
        const receivedSubscription = Notifications.addNotificationReceivedListener((notification) => {
            const type = notification.request.content.data.type;
            switch (type) {
                case 'daily-prompt':
                    NotificationHandlers.handleDailyPromptNotification(notification);
                    break;
                case 'new-follower':
                    NotificationHandlers.handleNewFollowerNotification(notification);
                    break;
                default:
                    console.log("Unhandled notification type:", type);
            }
        });

        const responseSubscription = Notifications.addNotificationResponseReceivedListener((response) => {
            console.log(JSON.stringify(response));
            const type = response.notification.request.content.data.type;
            switch (type) {
                case 'daily-prompt':
                    NotificationHandlerResponse.handleDailyPromptNotificationResponse(response, navigation);
                    break;
                case 'new-follower':
                    NotificationHandlerResponse.handleNewFollowerNotificationResponse(response, navigation, dailyPost);
                    break;
                default:
                    console.log("Unhandled notification response type:", type);
            }
        });
    }
    return () => {
        receivedSubscription.remove();
        responseSubscription.remove();
    };
};


