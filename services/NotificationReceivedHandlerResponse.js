import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

export const handleDailyPromptNotificationResponse = (notification) => {
    console.log("Handling message notification:", notification);
    navigation.navigate("challenge");
};

function getSubstringBeforeSpace(str) {
    const spaceIndex = str.indexOf(' ');
    
    if (spaceIndex !== -1) {
        return str.substring(0, spaceIndex);
    }
    return str;
}

export const handleNewFollowerNotificationResponse = (notification,navigation,dailyPost) => {
    console.log("y aqui el navigation es: " + navigation);
    const bodyText = notification.notification.request.content.body
    const user = getSubstringBeforeSpace(bodyText);
    navigation.navigate('profile', {
        fromScreen: dailyPost ? 'feed': 'challenge',
        userData:user 
      });
};

