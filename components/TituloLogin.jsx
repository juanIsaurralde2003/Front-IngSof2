import React from "react";
import { StyleSheet,View,Text,Image} from "react-native";
import StyledText from "../components/StyledText";
import { CameraIcon } from "./CameraIcon";


function TituloLogin(props){
    return(
        <View style = {styles.container}>
            <View style={styles.beRealContainer}>
                <Text style={styles.headerText}>
                    <Text style={styles.dontText}>DON'T</Text>
                    <Text style={styles.beRealText}> BE</Text>
                    <Text style={styles.beRealText}> REAL</Text>
                    
                </Text>
            </View>
            <View style={styles.cameraContainer}>
                <CameraIcon/>
            </View>   
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        flexDirection:'row',
        marginTop:190,
        justifyContent:'center',
        marginLeft:20
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
      headerText: {
        fontSize: 30,
        fontWeight: 'bold',
        //fontFamily: 'NotoSansTC-Regular', 
      },
      dontText: {
        color: '#000',
      },
      beRealText: {
        color: '#390294', 
      },
      cameraContainer:{
        margin:10
      },
      cameraIcon:{
        height:50,
        width:50
      }
})

export default TituloLogin;