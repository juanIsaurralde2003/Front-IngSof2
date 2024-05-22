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

export async function registerForPushNotificationsAsync(user,sessionToken) {
    try {
        if(user && sessionToken){
            console.log("NotificationService: el token que llega es: "+sessionToken)
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
            }
            const expoToken = (await Notifications.getExpoPushTokenAsync({
                projectId: 'a7e92cd2-f7c6-4810-9f88-891023c4b37b'
            })).data;
            const data = JSON.stringify({
                token: expoToken,
                username:user
            });
            console.log(data);
            const url = `${SERVER}/notifications/register-token`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization':`Bearer ${sessionToken}`
                },
                body: data
            });
            if(response.status === 200){
                console.log("token registrado correctamente");
            }
            else{
                console.error("NotificationService: Hubo un error con la solicitud: ",response.status);
            }
        }
        
    } catch (error) {
        console.error("Se produjo un error durante el registro de notificaciones push:  ", error);
    }
}

export const registerNotificationHandlers = async (navigation,dailyPost) => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    if(navigation && existingStatus === 'granted'){
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


