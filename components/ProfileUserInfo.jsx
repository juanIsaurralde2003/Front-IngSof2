import React from "react";
import { StyleSheet,View,Image,Text,TouchableOpacity} from "react-native";
import profilePicture from '../assets/profile_picture.png'
import StyledText from "./StyledText";
import { MaterialIcons,Entypo } from '@expo/vector-icons';
import { Rating } from 'react-native-ratings';


function ProfileUserInfo(){

    return(
        <View style={styles.container}>
            <View style={styles.optionsContainer}>
                <TouchableOpacity onPress={()=>{}} style={styles.buttonStyle}>
                    <Entypo name={'menu'} size={30} color={'black'}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{}} style={styles.buttonStyle}>
                    <MaterialIcons name={'close'} size={30} color={'black'} />
                </TouchableOpacity>
            </View>
            <Image 
                source = {profilePicture}
                style = {styles.profilePicture}
            />
            <View style={styles.usernameTextContainer}>
                <StyledText usernameText>@usuario</StyledText>
            </View>
            <View style={styles.raitingContainer}>
            <Rating
                readonly={true}
                type='star'
                ratingCount={5}
                imageSize={30}
                onFinishRating={this.ratingCompleted}
                
            />
            </View>
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
        marginBottom:50,
        backgroundColor:'white'
        
    },
    raiting:{
        marginTop:20
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
    raitingContainer:{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        marginTop:10
    },
    textoRetosTotalesContainer:{
        marginTop:30,
        marginRight:5
    },
    buttonStyle:{
        borderColor: "transparent",
        borderWidth: 0,
        borderRadius: 30,
        marginRight:140,
        marginLeft:150,
        marginTop:10
      }

    });


export default ProfileUserInfo;