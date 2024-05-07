import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, TextInput, ActivityIndicator, ScrollView, Image, Modal, Alert } from "react-native";
import UserDataComponent from "../components/UserDataComponent";
import CheckBox from '@react-native-community/checkbox';
import * as ImagePicker from 'expo-image-picker';
import { SERVER } from "../utils/utils";
import { format } from "date-fns";

function SignupScreen({ navigation }) {

  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isSignUpLoading, setIsSignUpLoading] = useState(false);
  const [datosInvalidos, setDatosInvalidos] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState(false);
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [terminosCondicionesAceptados, setTerminosCondicionesAceptados] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const newDate = new Date();
  const [birthday, setBirthday] = useState(format(newDate, 'yyyy-MM-dd'));


  const handleCancelButton = async () => {
    navigation.navigate('login');
  };

  const handleTermsAndConditions = () => {

  }


  const handleRegistrarButton = async () => {

    const url = `${SERVER}/auth/signup`

    const data = new FormData();
    // data = {
    //   username: username,
    //   password: password,
    //   email: email,
    //   birthday: birthday,
    //   file: profileImage
    // }
    data.append('username', username);
    data.append('password', password);
    data.append('email', email);
    data.append('birthday', birthday);

    if (profileImage) {
      const uriParts = profileImage.split('.');
      const fileType = uriParts[uriParts.length - 1];
  
      data.append('file', {
        uri: profileImage,
        name: `profile.${fileType}`,
        type: `image/${fileType}`,
      });
    }

    try {
      console.log(data)
      const respuesta = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: data,
        // body: JSON.stringify(data),
      });

      if (respuesta.ok) { 
        const JWT = await respuesta.json();
        console.log(JWT);
        //signIn(JWT);
        Alert.alert('Registro Exitoso', `Bienvenido a Don't be real`);
        navigation.navigate('login');

      } else if (respuesta.status === 400) {
        const errorMessage = await respuesta.text();
        console.error('Respuesta HTTP no exitosa:', respuesta.status, errorMessage);
        setDatosInvalidos(true);
      } else {
        // const errorMessage = await respuesta.text();
        // console.error('Respuesta HTTP no exitosa:', respuesta.status, errorMessage);
        setErrorGeneral(true);

      }
    } catch (error) {
      console.error('Error al realizar la solicitud:', error);
    }

  };

  const handleProfileImagePicker = async () => {
    // Permite al usuario seleccionar una imagen de la galería
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Se requiere permiso para acceder a la galería de fotos.");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync();

    if (pickerResult.canceled === true) {
      return;
    }

    setProfileImage(pickerResult.assets[0].uri);
  };

  return (
    <ScrollView style={styles.container} keyboardDismissMode="on-drag">
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
        {errorGeneral &&
          <Text style={styles.textError}>Hubo un problema al registrar el usuario</Text>
        }
        <TouchableOpacity
          disabled={isLoginLoading || !terminosCondicionesAceptados}
          style={styles.loginButton}
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
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Aquí van los términos y condiciones</Text>
            <TouchableOpacity onPress={() => setShowModal(false)}>
              <Text style={styles.closeModalButton}>Cerrar</Text>
            </TouchableOpacity>
          </View>
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
  secondContainer: {
    flex: 1,
    marginTop: 60,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textError: {
    color: '#D32F2F',
    textAlign: 'center',
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
    padding: 20,
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
    fontFamily: 'Quicksand-Bold'
  },

})


export default SignupScreen;