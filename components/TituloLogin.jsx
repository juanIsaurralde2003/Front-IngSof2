import React from "react";
import { StyleSheet,View,Text,Image} from "react-native";
import StyledText from "../components/StyledText";


function TituloLogin(props){
    return(
        <View style = {styles.container}>
            <View style={styles.beRealContainer}>
                <StyledText titleText>
                    Quest                     
                </StyledText>
            </View>   
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        flexDirection:'row',
        marginTop:190,
        justifyContent:'center'
    },
    beRealContainer:{
        alignItems:'center',
        justifyContent:'center',
    },
    icon: {
        color: '#000000',
        width: 54,
        height: 51,
        flex:1,
      },
})

export default TituloLogin;