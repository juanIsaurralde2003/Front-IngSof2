import React from "react";
import { FlatList, StyleSheet,View,Image,Text } from "react-native";
import ProfileUserInfo from "../components/ProfileUserInfo";

function ProfileScreen({navigation}){

    const publicaciones = [
        {username:"@username", raiting:4, image: "publicacion1", consigna:"Sube una foto que muestre formas geómetricas en lugares de la vida cotidiana.",fecha:"23/05/2017"},
        {username:"@username", raiting:4, image: "publicacion2", consigna:"Sube una foto de tu comida saludable del día.",fecha:"17/05/2017"},
    ]

    return(
        <FlatList 
            style={styles.lista}
            ListHeaderComponent={()=><ProfileUserInfo navigation={navigation}/>}
            data={publicaciones}
            renderItem={({item})=>(
                <Text>{item.consigna}</Text>
            )}

        />
    )
}

const styles= {
    lista:{
        marginTop:-75,
        flex:1,
    },
}


export default ProfileScreen;