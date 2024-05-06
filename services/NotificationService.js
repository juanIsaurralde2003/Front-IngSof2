import * as Notifications from 'expo-notifications';
import { SERVER } from '../utils/utils';


Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
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
        const pushToken = expoToken.substring(
            expoToken.indexOf('[') + 1, 
            expoToken.indexOf(']')
        );
        const data = JSON.stringify({
            token: pushToken
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
        console.error("Se produjo un error durante el registro de notificaciones push: ", error);
    }
}

export function addNotificationReceivedListener(handleNotification){
    return Notifications.addNotificationReceivedListener(handleNotification);
}

export function addNotificationResponseReceivedListener(handleNotificationResponse){
    return Notifications.addNotificationResponseReceivedListener(handleNotificationResponse);
}



