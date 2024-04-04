import React from "react";
import { StyleSheet,View,Image,Text} from "react-native";
import { Icon, ListItem} from 'react-native-elements';
import profilePicture from '../assets/profile_picture.png'
import StyledText from "./StyledText";


function ProfileUserInfo(){

    return(
        <View style={styles.container}>
            <View style={styles.optionsContainer}>
                <TouchableOpacity onPress={onPressHandler}>
                    <Image
                        source={{ uri: 'https://tusitio.com/tu-imagen.jpg' }} // Asegúrate de reemplazar esta URL por la dirección de tu imagen
                        style={{ width: 100, height: 100 }} // Ajusta el tamaño de la imagen según necesites
                    />
                </TouchableOpacity>
            </View>
            <Image 
                source = {profilePicture}
                style = {styles.profilePicture}
            />
            <View style={styles.usernameTextContainer}>
                <StyledText usernameText>@usuario</StyledText>
            </View>
            
            <Image

            />
            <View style={styles.textoRetosTotalesContainer}>
                <StyledText retosText> 15</StyledText>
                <StyledText>  retos</StyledText>
            </View>
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop:130,
        marginBottom:50
        
    },
    optionsContainer: {
        flex:1,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'flex-start',
        marginBottom:40
    },  
    profilePicture: {
        width: 200, // Ajusta el ancho como necesites
        height: 200, // Ajusta la altura como necesites
        borderRadius: 10000,
    },
    usernameTextContainer:{
        marginTop:20,
    },
    textoRetosTotalesContainer:{
        marginTop:30,
    },
    buttonStyle:{
        backgroundColor: "#fff",
        borderColor: "transparent",
        borderWidth: 0,
        borderRadius: 30,
        marginRight:300,
      }
    });


export default ProfileUserInfo;