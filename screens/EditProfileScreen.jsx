import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, ScrollView, Image, Modal, Alert, Dimensions, Linking } from "react-native";
import UserDataComponent from "../components/UserDataComponent";
import * as ImagePicker from 'expo-image-picker';
import { SERVER, TERMINOSCONDICIONES } from "../utils/utils";
import { useRoute } from "@react-navigation/native";
import { useAuth } from "../components/AuthContext";

function EditProfileScreen({ navigation }) {

  const route = useRoute();
  const { usuario, imagenPerfilURLOri, emailOri, birthdayOri } = route.params;

  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(imagenPerfilURLOri ? imagenPerfilURLOri : null);
  const [showModal, setShowModal] = useState(false);

  const {token, user} = useAuth();

  const { height, width } = Dimensions.get('window');

  const [username, setUsername] = useState(usuario ? `@${usuario}` : 'usuario');
  const [email, setEmail] = useState(emailOri);
  const [birthday, setBirthday] = useState(birthdayOri);

  useEffect(() => {
    console.log(imagenPerfilURLOri);
    console.log(profileImage);
  }, []);

  const handleCancelButton = () => {
    navigation.goBack();
  };

  const handleEliminarCuenta = async () => {
    try {
      const url = `${SERVER}/users/deleteAccount`
      console.log("el usuario es:" + username);
      const response = await fetch(url,{method: 'POST',
        headers: {
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}`
        },
        body: {
          username: user
        }
      });
      if(response.ok){
        const data = await response.json();
        console.log(data);
      }
      else{
        console.error("Respuesta HTTP no existosa en eliminarCuenta",response.status)
      }
    }
    catch (error) {
      console.error('Hubo un error en la petición',error);
    }
  }

  const handleCambiarContrasena = () => {
    console.log('hola')
  }

  const handleDefaultImage = async () => {
    //const asset = Asset.fromModule(require("../assets/person.jpg"));
    //await asset.downloadAsync();
    setProfileImage(null);
  };

  const handleSaveButton = async () => {
    setIsLoading(true);

    const url = `${SERVER}/users/update`;
    let headers = {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${token}`,
    }
    let body;

    const dataSimple = {
      username: usuario,
      email: email,
      birthday: birthday,
    }

    if (profileImage) {
      const data = new FormData();

      data.append('username', usuario);
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
      headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
      body = JSON.stringify(dataSimple);
    }

    try {
      console.log(body);
      const respuesta = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: body,
      });

      if (respuesta.ok) {
        Alert.alert('Perfil Actualizado', `Tu perfil ha sido actualizado con éxito.`);
        navigation.navigate('Profile');
      } else {
        const errorMessage = await respuesta.text();
        console.error('Respuesta HTTP no exitosa:', respuesta.status, errorMessage);
        Alert.alert('Error', 'Hubo un problema al actualizar el perfil.');
      }
    } catch (error) {
      console.error('Error al realizar la solicitud:', error);
      Alert.alert('Error', 'Hubo un problema al actualizar el perfil.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileImagePicker = async () => {
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
          setEmail={setEmail}
          setBirthday={setBirthday}
          initialUsername={username}
          initialEmail={email}
          initialBirthday={birthday}
          editing={true}
        />
        {/* <TouchableOpacity
          onPress={handleCambiarContrasena}
        >
          <Text style={styles.changePasswordTxt}>
            Cambiar Contraseña
          </Text>
        </TouchableOpacity> */}
        <TouchableOpacity onPress={handleDefaultImage}>
          <Text style={styles.resetImageText}>Restablecer imagen predeterminada</Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={isLoading || (!username || !email)}
          style={[styles.saveButton, { backgroundColor: (username && email) ? '#390294' : '#6e3aa7' }]}
          activeOpacity={0.8}
          onPress={handleSaveButton}
        >
          {isLoading ?
            <ActivityIndicator size="small" color="#FFFFFF" /> :
            <Text style={styles.saveText}>Guardar</Text>
          }
        </TouchableOpacity>
        <TouchableOpacity
          disabled={isLoading}
          style={styles.cancelButton}
          activeOpacity={0.8}
          onPress={handleCancelButton}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color='#390294' />
          ) : (
            <Text style={styles.cancelText}>Cancelar</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleEliminarCuenta}
        >
          <Text style={styles.deleteCuentaTxt}>
            ¿Desea Eliminar Su Cuenta?
          </Text>
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
    elevation: 3,
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
    elevation: 3,
    backgroundColor: '#f2f2f2',
  },
  secondContainer: {
    flex: 1,
    marginTop: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetImageText: {
    color: '#390294',
    marginBottom: 20,
    fontFamily: 'Quicksand-Bold',
  },
  saveButton: {
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    width: 200,
    alignItems: 'center',
    margin: 10,
    marginTop: 20,
  },
  saveText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
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
  cancelText: {
    color: '#390294',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Quicksand-Bold',
  },
  cancelButton: {
    backgroundColor: 'white',
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    width: 200,
    alignItems: 'center',
    marginBottom: 40,
  },
  deleteCuentaTxt: {
    fontFamily: 'Quicksand',
    color: '#191970',
    alignSelf: 'center',
    marginVertical: 17
  },
  changePasswordTxt: {
    fontFamily: 'Quicksand',
    alignSelf: 'center',
    marginVertical: 17
  }
});

export default EditProfileScreen;
