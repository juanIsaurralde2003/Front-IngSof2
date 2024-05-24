import React from "react";
import { StyleSheet,View,Image,Text,TouchableOpacity} from "react-native";
import StyledText from "./StyledText";
import { AuthProvider, useAuth } from "./AuthContext";

const ProfileStats= ({seguidores,seguidos,retos,navigation, fromScreen})=>{

    const {user} = useAuth();

    const handleSeguidosButton = async ()=>{
        navigation.navigate('followers', {
            fromScreen: fromScreen,
            fromAction: 'Following', 
        });
    }

    const handleSeguidoresButton = async ()=>{
        navigation.navigate('followers', {
            fromScreen: fromScreen,
            fromAction: 'Followers', 
        });
    }

    const handleRetosButton = async ()=>{
        navigation.navigate('retos');
    }

    return(
        <View style={styles.fftContainer}>
                {/* MÁS ADELANTE CAMBIAR FOLLOWERS Y FOLLOWING POR TOUCHABLEOPACITY */}
                    <View style={styles.statContainer}>
                        <TouchableOpacity onPress={handleSeguidosButton}>
                            <StyledText ffrText>
                                <Text style={{fontSize:20,fontFamily:'Quicksand-bold'}}> {seguidos}</Text> 
                            </StyledText>
                            <StyledText ffrText>  Seguidos</StyledText>
                        </TouchableOpacity>
                </View>
                <View style={{flexDirection:'row'}}>
                    <View style={styles.statColumn}></View>
                    <View style={styles.statContainer}>
                        <TouchableOpacity onPress={handleSeguidoresButton}>
                            <StyledText ffrText>
                                <Text style={{fontSize:20,fontFamily:'Quicksand-bold'}}> {seguidores}</Text>
                            </StyledText>
                            <StyledText ffrText>  Seguidores</StyledText>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{flexDirection:'row'}}>
                    <View style={styles.statColumn}></View>
                    <View style={styles.statContainer}>
                        <TouchableOpacity onPress={handleRetosButton}>
                            <StyledText ffrText>
                                <Text style={{fontSize:20,fontFamily:'Quicksand-bold'}}> {retos}</Text>
                            </StyledText>
                            <StyledText ffrText>  Retos</StyledText>
                        </TouchableOpacity>
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