
export const handleDailyPromptNotification = (notification,setDailyPost) => {
    console.log("Handling message notification:", notification);
    setDailyPost(false);
};

export const handleNewFollowerNotification = (notification) => {
    console.log("Handling system alert notification:", notification);
};
