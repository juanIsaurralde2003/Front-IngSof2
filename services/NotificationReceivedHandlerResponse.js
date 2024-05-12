import { useNavigation } from "@react-navigation/native";


export const handleDailyPromptNotificationResponse = (notification,navigation) => {
    console.log("Handling message notification:", notification);
    navigation.navigate("challenge");
};

export const handleNewFollowerNotificationResponse = (notification,navigation) => {
    console.log("Handling system alert notification:", notification);
    console.log(navigation);
    navigation.navigate("profile");
};