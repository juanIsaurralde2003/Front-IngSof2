import React from "react";
import { StyleSheet,View,Image,Text,TouchableOpacity, ActionSheetIOS} from "react-native";
import profilePicture from '../assets/profile_picture.png'
import StyledText from "./StyledText";
import { MaterialIcons,Entypo } from '@expo/vector-icons';
import { Rating } from 'react-native-ratings';
import { useAuth } from "./AuthContext";
import ProfileStats from "./ProfileStats";
import CustomRating from "./Rating";


function ProfileUserInfo({navigation,usuario,imageURI,seguidores,seguidos,retos,rating}){

    const {token, loading, signIn, signOut} = useAuth();
    const showActionSheet = () => {
        ActionSheetIOS.showActionSheetWithOptions(
          {
            options: ['Editar Perfil', 'Cerrar Sesión','Cancelar'],
            cancelButtonIndex:2,
            destructiveButtonIndex: 1,
          },
          buttonIndex => {
            if (buttonIndex === 0) {
               navigation.navigate()
            } else if (buttonIndex === 1) {
                signOut();  //REVISAR ASINCRONÍA
                navigation.navigate('login');
            }
          }
        );
      };
    

    return(
        <View style={styles.container}>
            <View style={styles.optionsContainer}>
                <TouchableOpacity onPress={showActionSheet} style={styles.menuStyle}>
                    <Entypo name={'menu'} size={30} color={'black'}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{navigation.navigate("feed")}} style={styles.closeStyle}>
                    <MaterialIcons name={'close'} size={30} color={'black'} />
                </TouchableOpacity>
            </View>
            <Image 
                source = {profilePicture}     //CAMBIAR POR URL DE LA BD
                style = {styles.profilePicture}
            />
            <View style={styles.usernameTextContainer}>
                <StyledText usernameText>{usuario}</StyledText>
            </View>
            <View style={styles.raitingContainer}>
                <CustomRating
                    defaultRating={rating}
                    readOnly={true}
                    maxRating={5}
                />
            <ProfileStats
                seguidores={seguidores}
                seguidos={seguidos}
                retos={retos}
            />
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
        paddingBottom:20
        
    },
    raiting:{
        marginTop:20
    },
    optionsContainer: {
        flex:1,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'flex-start',
        marginBottom:40,
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
        marginTop:7
    },
    menuStyle:{
        borderColor: "transparent",
        borderWidth: 0,
        borderRadius: 30,
        marginTop:10,
        paddingHorizontal:160
      },
      closeStyle:{
        borderColor: "transparent",
        borderWidth: 0,
        borderRadius: 30,
        marginTop:10,
        paddingHorizontal:160
      }

    });


export default ProfileUserInfo;