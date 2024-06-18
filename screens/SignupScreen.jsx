import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, ScrollView, Image, Modal, Alert, Dimensions, Linking } from "react-native";
import UserDataComponent from "../components/UserDataComponent";
import * as ImagePicker from 'expo-image-picker';
import { SERVER, TERMINOSCONDICIONES } from "../utils/utils";
import { format } from "date-fns";
import { Asset } from 'expo-asset';

function SignupScreen({ navigation }) {

  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isSignUpLoading, setIsSignUpLoading] = useState(false);
  const [datosInvalidos, setDatosInvalidos] = useState(false);
  const [emailInvalido, setEmailInvalido] = useState(false);
  const [contrasenaInvalida, setContrasenaInvalida] = useState(false);
  const [usuarioExistente, setUsuarioExistente] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState(false);
  const [terminosCondicionesAceptados, setTerminosCondicionesAceptados] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const { height, width } = Dimensions.get('window');

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const newDate = new Date();
  const maximumDate = new Date(newDate.getFullYear() - 15, newDate.getMonth(), newDate.getDate() - 1);
  const [birthday, setBirthday] = useState(format(maximumDate, 'yyyy-MM-dd'));


  const handleCancelButton = async () => {
    navigation.navigate('login');
  };

  const handleDefaultImage = async () => {
    const asset = Asset.fromModule(require("../assets/person.jpg"));
    await asset.downloadAsync();

    return asset.localUri;
  };

  const handleTermsAndConditions = () => {

  }

  const validarEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }


  const handleRegistrarButton = async () => {

    setDatosInvalidos(false);
    setEmailInvalido(false);
    setErrorGeneral(false);
    setContrasenaInvalida(false);
    setUsuarioExistente(false);

    const isValidEmail = validarEmail();
    if (!isValidEmail) {
      setEmailInvalido(true);
      return;
    }

    setIsLoginLoading(true);

    let url = `${SERVER}/auth/signup`;
    let headers = {
      'Content-Type': 'multipart/form-data',
    }
    let body;

    const dataSimple = {
      username: username,
      password: password,
      email: email,
      birthday: birthday,
    }

    if (profileImage) {

      const data = new FormData();

      data.append('username', username);
      data.append('password', password);
      data.append('email', email);
      data.append('birthday', birthday);

      const uriParts = profileImage.split('.');
      const fileType = uriParts[uriParts.length - 1];

      const nombreArchivo = `profile_${username}`;

      data.append('file', {
        uri: profileImage,
        name: `${nombreArchivo}.${fileType}`,
        type: `image/${fileType}`,
      });

      body = data;
    } else {
      // const defaultImageUri = await handleDefaultImage();

      // data.append('file', {
      //   uri: defaultImageUri,
      //   name: `profile_${username}.jpg`,
      //   type: `image/jpeg`,
      // });
      console.log('Cambio url')
      url = `${SERVER}/auth/signup/nopic`,
        headers = { 'Content-Type': 'application/json' }
      body = JSON.stringify(dataSimple);
    }

    try {
      console.log('Datos: ')
      console.log(url);
      console.log(headers);
      console.log(body);
      const respuesta = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: body,
        // body: JSON.stringify(data),
      });

      if (respuesta.ok) {
        const JWT = await respuesta.json();
        console.log(JWT);
        //signIn(JWT);
        Alert.alert('Registro Exitoso', `Bienvenido a Don't be real`);
        navigation.navigate('login');

      } else {
        const errorMessage = await respuesta.text();
        console.log('Respuesta HTTP no exitosa:', respuesta.status, errorMessage);
        if (respuesta.status === 400) {
          const errorJSON = JSON.parse(errorMessage);
          if (errorJSON.message.includes('password is not strong enough')) {
            // Realizar acciones específicas para cuando la contraseña no es lo suficientemente fuerte
            setContrasenaInvalida(true);
          } else if (errorJSON.message === 'User already exists') {
            // Realizar acciones específicas para cuando el usuario ya existe
            setUsuarioExistente(true);
          }
        } else if (respuesta.status === 500 && errorMessage.includes(' already exists with label `User` and property `email` =')) {
          setUsuarioExistente(true);
        } else {
          // Manejar otros errores generales
          setErrorGeneral(true);
        }
      }
    } catch (error) {
      ////console.error('Error al realizar la solicitud:', error);
    } finally {
      setIsLoginLoading(false);
    }

  };

  const handleProfileImagePicker = async () => {
    // Permite al usuario seleccionar una imagen de la galería
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert(
        'Permisos necesarios',
        'Se requiere permiso para acceder a la galería de fotos.',
        [
          { text: 'Cancelar', onPress: () => console.log('Cancelado') },
          { text: 'Otorgar permisos', onPress: () => Linking.openSettings() },
        ]
      );
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync();

    if (pickerResult.canceled === true) {
      return;
    }

    setProfileImage(pickerResult.assets[0].uri);
  };

  return (
    <ScrollView style={styles.container} keyboardDismissMode="on-drag" bounces={false}>
      <View style={styles.secondContainer}>
        <TouchableOpacity onPress={handleProfileImagePicker}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <Image source={require("../assets/person.jpg")} style={styles.profileIcon} />
          )}
        </TouchableOpacity>
        <UserDataComponent
          setUsername={setUsername}
          setPassword={setPassword}
          setEmail={setEmail}
          setBirthday={setBirthday}
          editing={false}
        />
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', padding: 10, marginTop: 20, }}>
          <TouchableOpacity
            onPress={() => setTerminosCondicionesAceptados(!terminosCondicionesAceptados)}
            style={{
              borderWidth: 2,
              borderColor: '#390294',
              alignItems: 'center',
              justifyContent: 'center',
              width: 25,
              height: 25,
              backgroundColor: terminosCondicionesAceptados ? '#390294' : 'transparent',
              borderRadius: 10,
              marginRight: 10
            }}
          />
          <View style={{ flexDirection: 'row', paddingHorizontal: 10 }}>
            <Text style={styles.termsAndConditions} adjustsFontSizeToFit numberOfLines={1}>Acepto los </Text>
            <TouchableOpacity onPress={() => setShowModal(true)}>
              <Text style={[styles.termsAndConditions, { textDecorationLine: 'underline', color: 'blue', fontWeight: 'bold' }]} adjustsFontSizeToFit numberOfLines={1}>términos y condiciones</Text>
            </TouchableOpacity>
          </View>
        </View>
        {datosInvalidos &&
          <Text style={styles.textError}>Datos invalidos</Text>
        }
        {emailInvalido &&
          <Text style={styles.textError}>Email inválido</Text>
        }
        {contrasenaInvalida &&
          <Text style={styles.textError}>Contraseña inválida</Text>
        }
        {usuarioExistente &&
          <Text style={styles.textError}>El nombre de usuario o el correo electrónico ingresados ya están en uso</Text>
        }
        {errorGeneral &&
          <Text style={styles.textError}>Hubo un problema al registrar el usuario</Text>
        }
        <TouchableOpacity
          disabled={isLoginLoading || (!terminosCondicionesAceptados || !username || !email || !password)}
          style={[styles.loginButton, { backgroundColor: (terminosCondicionesAceptados && username && email && password) ? '#390294' : '#6e3aa7' }]}
          activeOpacity={0.8}
          onPress={handleRegistrarButton}
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
      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <ScrollView style={[styles.modalContent, { maxHeight: height * 0.75 }]}>
            <Text style={styles.modalText}>{TERMINOSCONDICIONES}</Text>
            <TouchableOpacity onPress={() => setShowModal(false)}>
              <Text style={styles.closeModalButton}>Cerrar</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </ScrollView>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileIcon: {
    width: 125,
    height: 125,
    borderRadius: 70,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#505050',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3, // equivalente a boxShadow en Android para efecto de elevación
    backgroundColor: '#f2f2f2',
  },
  profileImage: {
    width: 125,
    height: 125,
    borderRadius: 70,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#505050',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3, // equivalente a boxShadow en Android para efecto de elevación
    backgroundColor: '#f2f2f2',
  },
  secondContainer: {
    flex: 1,
    marginTop: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textError: {
    color: '#D32F2F',
    textAlign: 'center',
    padding: 5,
  },
  loginButton: {
    //backgroundColor: '#390294', // Color de fondo del botón
    paddingVertical: 14,        // Espaciado vertical dentro del botón
    paddingHorizontal: 10,      // Espaciado horizontal dentro del botón
    borderRadius: 20,           // Bordes redondeados
    shadowColor: '#000',        // Sombra
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    width: 200,
    alignItems: 'center',
    margin: 10,
    marginTop: 20,
  },
  signUpButton: {
    backgroundColor: 'white', // Color de fondo del botón
    paddingVertical: 14,        // Espaciado vertical dentro del botón
    paddingHorizontal: 10,      // Espaciado horizontal dentro del botón
    borderRadius: 20,           // Bordes redondeados
    shadowColor: '#000',        // Sombra
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    width: 200,
    alignItems: 'center',
    marginBottom: 40,

  },
  loginText: {
    color: '#FFFFFF',           // Color del texto
    fontSize: 16,               // Tamaño del texto
    textAlign: 'center',        // Alineación del texto,
    fontFamily: 'Quicksand-Bold'

  },
  signUpText: {
    color: '#390294',           // Color del texto
    fontSize: 16,               // Tamaño del texto
    textAlign: 'center',
    fontFamily: 'Quicksand-Bold'
  },
  termsAndConditions: {
    color: '#191970',
    alignSelf: 'center',
    marginVertical: 17,
    fontFamily: 'Quicksand-Bold'
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
    fontFamily: 'Quicksand'
  },
  closeModalButton: {
    fontSize: 16,
    color: '#390294',
    alignSelf: 'flex-end',
    fontFamily: 'Quicksand-Bold',
    marginBottom: 15,
  },

})


export default SignupScreen;