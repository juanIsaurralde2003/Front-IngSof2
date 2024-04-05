import React from "react";
import { Touchable,Image,View } from "react-native";
import { StyleSheet,TouchableOpacity} from "react-native-web";

const StarRating = ({rating,maxRating}) => {
    const RenderStars = () => {
        const starFull = require('../assets/full-star3.png');
        const starEmpty = require('../assets/empty-star3.png');
        let stars = [];
        for(let i=1;i<=maxRating;i++){
            stars.push(
                <Image 
                    key={i}
                    source={i <= rating ? starFull : starEmpty}
                    style={{ height: 25, width: 25 }}
                />
            )
        }
        return stars
    }
    return <View style={{ flexDirection: 'row', backgroundColor: 'transparent', marginTop:10 }}>{RenderStars()}</View>;
}

export default StarRating