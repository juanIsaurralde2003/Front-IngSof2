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

export async function registerForPushNotificationsAsync(user,sessionToken,sessionExpired) {
    try {
        if(user && sessionToken &&  sessionExpired !== null && !sessionExpired){
            console.log("NotificationService: el token que llega es: "+sessionToken)
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            if(finalStatus === 'granted'){
                const expoToken = (await Notifications.getExpoPushTokenAsync({
                    projectId: 'a7e92cd2-f7c6-4810-9f88-891023c4b37b'
                })).data;
                const data = JSON.stringify({
                    token: expoToken,
                    username:user
                });
                console.log(data);
                console.log("NotificationService: El token de la sesión es: "+sessionToken);
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
                    //console.error("NotificationService: Hubo un error con la solicitud: ",response.status);
                }
            }
            else {
                console.log("NotificationService: Permisos de notificaciones no concedidos");
            }
        }
        
    } catch (error) {
        //console.error("Se produjo un error durante el registro de notificaciones push:  ", error);
    }
}

export const registerNotificationHandlers = async (navigation,dailyPost,setDailyPost) => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let receivedSubscription;
    let responseSubscription;
    if(navigation && existingStatus === 'granted'){
        receivedSubscription = Notifications.addNotificationReceivedListener((notification) => {
            const type = notification.request.content.data.type;
            switch (type) {
                case 'daily-prompt':
                    NotificationHandlers.handleDailyPromptNotification(notification,setDailyPost);
                    break;
                case 'new-follower':
                    NotificationHandlers.handleNewFollowerNotification(notification);
                    break;
                default:
                    console.log("Unhandled notification type:", type);
            }
        });

        responseSubscription = Notifications.addNotificationResponseReceivedListener((response) => {
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
        if (receivedSubscription) {
            receivedSubscription.remove();
        }
        if (responseSubscription) {
            responseSubscription.remove();
        }
    };
};

export const deletePushToken = async (username, token) => {
    try {
        const url = `${SERVER}/notifications/pushToken/${encodeURIComponent(username)}`;
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (response.status === 200) {
            console.log("NotificationService: push token borrado correctamente");
        } else {
            //console.error("NotificationService: Hubo un error con la solicitud HTTP",response.status);
        }
    } catch (e) {
        //console.error("NotificationService: Error borrando el push token", e);
    }
}


