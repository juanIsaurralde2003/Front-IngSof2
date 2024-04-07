import React, { useState } from "react";
import { StyleSheet,View,Text,TouchableOpacity,TextInput,ActivityIndicator,ScrollView, Image } from "react-native";
import UserDataComponent from "../components/UserDataComponent";
import CheckBox from '@react-native-community/checkbox';
import * as ImagePicker from 'expo-image-picker';

function SignupScreen({navigation}){

    const [isLoginLoading,setIsLoginLoading] = useState(false);
    const [isSignUpLoading,setIsSignUpLoading] = useState(false);
    const [credencialesIncorrectas,setCredencialesIncorrectas] = useState(false);
    const [toggleCheckBox, setToggleCheckBox] = useState(false)
    const [profileImage, setProfileImage] = useState(null);

    const handleCancelButton = async () => {
        navigation.navigate('login');
    };

    const handleTermsAndConditions = () => {
  
    }

    const handleSignUpButton = () => {
      setIsSignUpLoading(true);
      navigation.navigate('feed');
    }

    const handleProfileImagePicker = async () => {
      // Permite al usuario seleccionar una imagen de la galería
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
          alert("Se requiere permiso para acceder a la galería de fotos.");
          return;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync();
      
      if (pickerResult.cancelled === true) {
          return;
      }

      setProfileImage(pickerResult.assets[0].uri);
  };

    return(
      <ScrollView style={styles.container} keyboardDismissMode="on-drag">
          <View style = {styles.secondContainer}>
              {credencialesIncorrectas &&
              <Text style={styles.credencialesError}>Usuario o contraseña incorrectos</Text>
              }
              <TouchableOpacity onPress={handleProfileImagePicker}>
                    {profileImage ? (
                        <Image source={{ uri: profileImage }} style={styles.profileImage} />
                    ) : (
                        <Image source={require("../assets/person.jpg")} style={styles.profileIcon} />
                    )}
              </TouchableOpacity>
              <UserDataComponent/>
              {/* <CheckBox
                disabled={false}
                value={toggleCheckBox}
                onValueChange={(newValue) => setToggleCheckBox(newValue)}
              /> */}
              <TouchableOpacity
                onPress={handleTermsAndConditions}
              >
                <Text style={styles.termsAndConditions}>
                  Aceptar Términos y Condiciones
                </Text>  
              </TouchableOpacity>   
              <TouchableOpacity 
                  disabled={isLoginLoading}
                  style={styles.loginButton}
                  activeOpacity={0.8}
                  onPress={handleSignUpButton}
              >
                  {isLoginLoading ? 
                    <ActivityIndicator size="small" color="#FFFFFF" /> : 
                    <Text style={styles.loginText}>Registrarse</Text>
                  }
              </TouchableOpacity>
              <TouchableOpacity 
                  disabled={isSignUpLoading}
                  style={styles.signUpButton}
                  activeOpacity={0.8}
                  onPress={handleCancelButton}
                  >
                  {isSignUpLoading ? 
                  <ActivityIndicator size="small" color='#390294' /> : 
                  <Text style={styles.signUpText}>Cancelar</Text>
                  }
              </TouchableOpacity>
          </View>
      </ScrollView>  
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
      },
      profileIcon: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 20,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 20,
    },
      secondContainer:{
        flex:1,
        marginTop:60,
        justifyContent:'center',
        alignItems:'center'
      },
      credencialesError:{
        color:'#D32F2F',
        textAlign:'left',
        marginRight:65
      },
    loginButton: {
        backgroundColor: '#390294', // Color de fondo del botón
        paddingVertical: 14,        // Espaciado vertical dentro del botón
        paddingHorizontal: 10,      // Espaciado horizontal dentro del botón
        borderRadius: 20,           // Bordes redondeados
        shadowColor: '#000',        // Sombra
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
        width:200,
        alignItems:'center',
        margin: 10,
        marginTop: 20,             
      },
      signUpButton:{
        backgroundColor: 'white', // Color de fondo del botón
        paddingVertical: 14,        // Espaciado vertical dentro del botón
        paddingHorizontal: 10,      // Espaciado horizontal dentro del botón
        borderRadius: 20,           // Bordes redondeados
        shadowColor: '#000',        // Sombra
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
        width:200,
        alignItems:'center',
         
      },
      loginText: {
        color: '#FFFFFF',           // Color del texto
        fontSize: 16,               // Tamaño del texto
        fontWeight: 'bold',         // Negrita para el texto
        textAlign: 'center',        // Alineación del texto,
        
      },
      signUpText:{
        color: '#390294',           // Color del texto
        fontSize: 16,               // Tamaño del texto
        fontWeight: 'bold',         // Negrita para el texto
        textAlign: 'center',
      },
      termsAndConditions:{
        color:'#191970',
        alignSelf:'center',
        marginVertical:17,
        fontFamily:'Quicksand-Bold'
      },
      
})


export default SignupScreen;