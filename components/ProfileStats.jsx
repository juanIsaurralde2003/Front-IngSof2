import React from "react";
import { StyleSheet,View,Image,Text,TouchableOpacity, ActionSheetIOS} from "react-native";
import profilePicture from '../assets/profile_picture.png'
import StyledText from "./StyledText";
import { MaterialIcons,Entypo } from '@expo/vector-icons';
import { Rating } from 'react-native-ratings';
import { useAuth } from "./AuthContext";

const ProfileStats= ({seguidores,seguidos,retos})=>{
    return(
        <View style={styles.fftContainer}>
                {/* MÁS ADELANTE CAMBIAR FOLLOWERS Y FOLLOWING POR TOUCHABLEOPACITY */}
                    <View style={styles.statContainer}>
                    <StyledText ffrText>
                            <Text style={{fontSize:20,fontFamily:'Quicksand-bold'}}> {seguidos}</Text> 

                        </StyledText>
                        <StyledText ffrText>  Seguidos</StyledText>
                </View>
                <View style={{flexDirection:'row'}}>
                    <View style={styles.statColumn}></View>
                    <View style={styles.statContainer}>
                        <StyledText ffrText>
                            <Text style={{fontSize:20,fontFamily:'Quicksand-bold'}}> {seguidores}</Text>
                        </StyledText>
                        <StyledText ffrText>  Seguidores</StyledText>
                    </View>
                </View>
                <View style={{flexDirection:'row'}}>
                    <View style={styles.statColumn}></View>
                    <View style={styles.statContainer}>
                        <StyledText ffrText>
                            <Text style={{fontSize:20,fontFamily:'Quicksand-bold'}}> {retos}</Text>
                        </StyledText>
                        <StyledText ffrText>  Retos</StyledText>
                    </View>
                </View>
            </View>
    )
}


const styles = StyleSheet.create({
    fftContainer:{
        flex:1,
        flexDirection:'row',
        justifyContent:'center',
        paddingTop:25,
        paddingRight:7,
    },
    statColumn:{ 
        height: '100%',
        width: 0.5,
        backgroundColor: 'grey',
        marginRight:10
    },
    statContainer:{
        paddingRight:19,
    }
})

export default ProfileStats;