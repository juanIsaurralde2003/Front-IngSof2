import React, { useEffect, useState } from "react";
import { View,StyleSheet,Modal,Text,TouchableOpacity,Image } from "react-native";
import { useAuth } from "./AuthContext";
import { useNavigation } from "@react-navigation/native";


export const SessionExpired = () => {
    const [isVisible,setIsVisible] = useState(true);
    const {validToken} = useAuth()
    const navigator = useNavigation();
    
    useEffect(()=>{
        setIsVisible(validToken);
    },[validToken]);

    const handleLoginPress = ()=>{
        navigator.navigate('login');
        setIsVisible(false);
    }

    return(
        <View style={styles.container}>
            <Modal
                animationType="fade"
                transparent={true}
                visible={isVisible}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.topContainer}>
                        <View style={styles.iconContainer}>
                            <Image source={require('../assets/alert.png')} style={styles.icon}/>
                        </View>
                        <View style={styles.tittleContainer}>
                            <Text style={styles.tittleText}> Tu sesión ha expirado</Text>
                        </View>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.text}> Por favor, vuelve a iniciar sesión para continuar usando la app.</Text>   
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={handleLoginPress}style={styles.loginButton}>
                            <Text style={styles.loginText}>Login</Text>
                        </TouchableOpacity>
                    </View>   
                </View>  
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        justifyContent:'center',

    },
    modalContainer:{
        backgroundColor: 'white', 
        justifyContent:'center',
        alignSelf:'center',
        top:300,
        padding:20,
        width:300,
        borderColor:'#4402b2',
        borderWidth:2

    },
    topContainer:{
        flexDirection:'row',
    },
    iconContainer:{
        marginRight:5,
        marginTop:-5,
        marginLeft:-5
    },
    icon:{
        height:30,
        width:30
    },
    tittleContainer:{
        alignSelf:'center',
        marginLeft:0
    },
    tittleText:{
        color:'black',
        fontSize:16,
        fontWeight:'bold',
    },
    textContainer:{
        marginTop:15,
        marginBottom:15
    },
    text:{ 
        color:'black',
        fontSize:14
    },
    buttonContainer:{
        alignItems:'flex-end'
    },
    loginButton:{
        borderColor:'#4402b2',
        borderWidth:1.5,
        padding:10,
        paddingHorizontal:20,
        borderRadius:18,
        backgroundColor:'#4402b2'
    },
    loginText:{
        textAlign:'right',
        color:'white',
    }

})