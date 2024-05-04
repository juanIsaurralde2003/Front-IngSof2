import React, {useState, useEffect } from "react";
import {Platform, StyleSheet,View,Text,TouchableOpacity,TextInput,ActivityIndicator,ScrollView} from "react-native";
import StyledText from "../components/StyledText";
import TituloLogin from "../components/TituloLogin";
import { useAuth } from "../components/AuthContext";
import { useFonts } from 'expo-font';
import { SERVER } from "../utils/utils";

function LoginScreen({navigation}){
  const {user, token, profilePicture, loading, signIn, signOut} = useAuth();
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isSignUpLoading, setIsSignUpLoading] = useState(false);
  const [credencialesIncorrectas, setCredencialesIncorrectas] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [profilePic, setProfilePic] = useState(null);

  const handleForgotPassword = () => {
    navigation.navigate('login'); //cambiar esto cuando esté pronta la pantalla de forgotPassword

  }

  const getProfileUserInfo = async (JWT) => {
    try {
      const url = `${SERVER}/users/followInfo/${encodeURIComponent(username)}`
      console.log("el usuario es:" + username);
      const response = await fetch(url,{method: 'GET',
        headers: {
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}`
        }
      });
      if(response.ok){
        const data = await response.json();
        console.log(data);
        setProfilePic(data.user.user.profilePicture);
        signIn(JWT, username, data.user.user.profilePicture);
        console.log('Obtuve foto del usuario');
      }
      else{
        console.error("Respuesta HTTP no existosa",response.status)
      }
    }
    catch (error) {
      console.error('Hubo un error en la petición',error);
    }
  }
  
  const handleLoginButton = async () => {

    setIsLoginLoading(true);
    const url = `${SERVER}/auth/login`
    const urlPost = `${SERVER}/users/status/${username}`;
    console.log(urlPost);

    data = {
      username: username,
      password: password
    }

    try {
      const respuesta = await fetch(url, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (respuesta.status === 200) { //Cambiar a 200 después
        const datos = await respuesta.json(); 
        console.log(datos);
        const JWT = datos.auth.token;
        await getProfileUserInfo(JWT);
        console.log('Voy a hacer login');
        
        setUsername('');
        setPassword('');
        
        const respuestaPost = await fetch(urlPost, {
          method: 'GET',
        });


        if (respuestaPost.status === 200) {
          setCredencialesIncorrectas(false);
          navigation.navigate('feed');
        } else if (respuestaPost.status === 403) {
          setCredencialesIncorrectas(false);
          navigation.navigate('challenge');
        } else {
          console.error('Respuesta HTTP 2 no exitosa:', respuestaPost.status);
        }
      } else if (respuesta.status === 400){
        setCredencialesIncorrectas(true);
      } else {
        console.error('Respuesta HTTP no exitosa:', respuesta.status);
      }
    } catch (error) {
      console.error('Error al realizar la solicitud:', error);
    } finally {
      setIsLoginLoading(false);
    }
    
  };

  useEffect(() => {
    if (token) {
      console.log("el token es: " + token); 
      console.log("el usuario es: " + user);
      console.log("la foto de perfil es: " + profilePicture)
    }
  }, [token,user,profilePicture]); 

  const handleSignUpButton = () => {
    try{
      //setIsSignUpLoading(true);
      navigation.navigate('signup');
    }
    catch(error){
      console.error('Algo no funciona adecuadamente',error);
    }
  }
  return(
    <ScrollView style={styles.container} keyboardDismissMode="on-drag">
        <TituloLogin/>
        <View style = {styles.secondContainer}>
            {credencialesIncorrectas &&
            <Text style={styles.credencialesError}>Usuario o contraseña incorrectos</Text>
            }
            <TextInput 
              style={styles.inputText}
              autoCapitalize="none"
              onChangeText={setUsername}
              value={username}
              placeholder="Usuario"
              placeholderTextColor="#575757"
              />

            <TextInput 
                style={styles.inputText}
                onChangeText={setPassword}
                value={password}
                placeholder="Contraseña"
                secureTextEntry={true}
                placeholderTextColor="#575757"
                />
            <TouchableOpacity
              onPress={handleForgotPassword}
            >
              <Text style={styles.forgotPswText}>
                ¿Olvidaste tu contraseña?
              </Text>
            </TouchableOpacity>  
            <TouchableOpacity 
                disabled={isLoginLoading}
                style={styles.loginButton}
                activeOpacity={0.8}
                onPress={handleLoginButton}
            >
                {isLoginLoading ? 
                  <ActivityIndicator size="small" color="#FFFFFF" /> : 
                  <Text style={styles.loginText}>Login</Text>
                }
            </TouchableOpacity>
            <View style={styles.dividerContainer}>
                <View style={[styles.dividerLine, {marginLeft:30}]} />
                <Text style={styles.dividerText}>O</Text>
                <View style={[styles.dividerLine, {marginRight:30}]} />
            </View>
            <TouchableOpacity 
                disabled={isSignUpLoading}
                style={styles.signUpButton}
                activeOpacity={0.8}
                onPress={handleSignUpButton}
                >
                {isSignUpLoading ? 
                <ActivityIndicator size="small" color='#390294' /> : 
                <Text style={styles.signUpText}>Registrarse</Text>
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
    inputText: {
      paddingVertical:13,
      paddingLeft: 18,
      paddingRight: 8,
      borderColor: '#505050',
      borderWidth: 1, // Se separa border en borderColor y borderWidth
      // boxSizing no es necesario ya que el tamaño de caja en React Native siempre es border-box
      borderRadius: 25,
      // React Native maneja las sombras de forma diferente
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 3, // equivalente a boxShadow en Android para efecto de elevación
      backgroundColor: '#f2f2f2',
      fontSize: 14,
      fontFamily: 'Quicksand', // Asegúrate de que esta fuente está disponible o usa una por defecto
      marginTop:10,
      width:300,
      
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
      fontFamily:'Quicksand-Bold',
      color: '#FFFFFF',           // Color del texto
      fontSize: 16,               // Tamaño del texto
      fontWeight: 'bold',         // Negrita para el texto
      textAlign: 'center',        // Alineación del texto,
      
    },
    signUpText:{
      fontFamily:'Quicksand-Bold',
      color: '#390294',           // Color del texto
      fontSize: 16,               // Tamaño del texto
      fontWeight: 'bold',         // Negrita para el texto
      textAlign: 'center',
    },
    forgotPswText:{
      fontFamily:'Quicksand',
      color:'#191970',
      alignSelf:'center',
      marginVertical:17
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: '#191970',
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 4.65,
        },
        android: {
          elevation: 8,
        },
        web: {
        },
      }),
      marginHorizontal:10,
      },
      dividerText: {
        fontFamily:'Quicksand',
        color:'#191970',
        marginHorizontal: 5,
        ...Platform.select({
          ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 4.65,
          },
          android: {
            elevation: 8,
          },
          web: {
          },
        }),
        
      },
      dividerContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          marginVertical: 20,
      },
})


export default LoginScreen;