//NO ESTÁ PRONTA

import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity, TextInput, ActivityIndicator, ScrollView, Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "../components/AuthContext";
import { SERVER } from "../utils/utils";

function ChangePasswordScreen() {

  const route = useRoute();
  const { forgotten } = route.params;
  const [paramsReceived, setParamsReceived] = useState(false);

  const navigation = useNavigation();

  const {user, token} = useAuth();

  const [forgotPassword, setForgotPassword] = useState(forgotten);

  const [mail, setMail] = useState('');

  const [mailSent, setMailSent] = useState(false);

  const [originalPassword, setOriginalPassword] = useState('');
  const [showOriginalPassword, setShowOriginalPassword] = useState(false);

  const [firstPassword, setFirstPassword] = useState('');
  const [secondPassword, setSecondPassword] = useState('');
  const [differentPassword, setDifferentPassword] = useState(false);
  const [samePassword, setSamePassword] = useState(false);
  const [wrongPasswordType, setWrongPasswordType] = useState(false);

  const [tokenPass, setTokenPass] = useState(''); 
  const [tokenValido, setTokenValido] = useState(false);
  const [tokenInvalido, setTokenInvalido] = useState(false);

  const [showFirstPassword, setShowFirstPassword] = useState(false);
  const [showSecondPassword, setShowSecondPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHandle, setIsLoadingHandle] = useState(false);

  const validarEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(mail);
  }


  useEffect(() => {
    if (forgotten !== undefined) {
      setForgotPassword(forgotten);
      setParamsReceived(true);
    }
    console.log('Check params');
  }, [forgotten]);

  const handleCancelButton = () => {
    setIsLoading(true);
    navigation.goBack();
    setIsLoading(false);
  };

  const handleShowPassword = (setPassword, showPassword) => {
    setPassword(!showPassword); // Cambia entre mostrar y ocultar la contraseña
  };

  const handleForgotPassword = () => {
    setFirstPassword('');
    setSecondPassword('');
    setOriginalPassword('');
    setForgotPassword(true);
  }

  const handleSendMail = async () => {

    setIsLoadingHandle(true);

    if (!mail) {
      Alert.alert('Error', 'Por favor, proporciona un usuario válido')
      setIsLoadingHandle(false);
      return;
    }

    // const isValidEmail = validarEmail();
    // if (!isValidEmail) {
    //   Alert.alert('Error', 'Por favor, proporciona un mail de correo válido')
    //   setIsLoadingHandle(false);
    //   return;
    // }

    const url = `${SERVER}/auth/forgotpassword`
  
    const data = {
      username: mail,
    }
  
    console.log(data);
      try {
        const respuesta = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
  
        if (respuesta.ok) {
          //setMail('');
          setMailSent(true);
        } else {
          //console.error('Respuesta HTTP no exitosa:', respuesta.status);
        }
      } catch (error) {
        //console.error('Error al realizar la solicitud:', error);
      } finally {
        setIsLoadingHandle(false);
      }

    console.log('Send Mail');

  };

  const handleSendToken = async () => {

    setTokenInvalido(false);

    setIsLoadingHandle(true);

    if (!tokenPass) {
      Alert.alert('Error', 'Por favor, ingresa el código')
      setIsLoadingHandle(false);
      return;
    }

    const url = `${SERVER}/auth/checktoken`
  
    const data = {
      username: mail,
      token: tokenPass
    }

    console.log(data);
  
    try {
      const respuesta = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (respuesta.ok) {
        //setTokenPass('');
        setTokenValido(true);
      } else {
        setTokenInvalido(true)
        //console.error('Respuesta HTTP no exitosa:', respuesta.status);
      }
    } catch (error) {
      //console.error('Error al realizar la solicitud:', error);
    } finally {
      setIsLoadingHandle(false);
    }
  };

  const handleSendPassword = async () => {
    setDifferentPassword(false);
    setWrongPasswordType(false);
    setSamePassword(false);
  
    if (firstPassword !== secondPassword) {
      setDifferentPassword(true);
      return;
    }

    if (!forgotPassword) {
      if (firstPassword === originalPassword) {
        setSamePassword(true);
        return;
      }
    }
  
    const url = forgotPassword 
      ? `${SERVER}/auth/changepasswordtoken`
      : `${SERVER}/auth/change-password`;
  
    const data = forgotPassword 
      ? {
          username: mail,
          newPassword: firstPassword,
          token: tokenPass,
        }
      : {
          username: user,
          currentPassword: originalPassword,
          newPassword: firstPassword,
        };
  
    setIsLoadingHandle(true);
  
    console.log(data)
    try {
      const respuesta = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
  
      if (respuesta.ok) {
        console.log('Contraseña modificada exitosamente');
        Alert.alert('Contraseña Modificada Exitosamente');
        setFirstPassword('');
        setSecondPassword('');

        //navigation.navigate('EditProfile');
        if (forgotPassword) {
          navigation.navigate('login')
        } else {
          navigation.navigate('profile', {
            fromScreen: 'feed',
            userData: user
          });
        }
        
      } else {
        const data = await respuesta.json();

        if (respuesta.status === 400) {

          setWrongPasswordType(true);
        }
        //
        console.log(data);
      }
    } catch (error) {
      //console.error('Error al realizar la solicitud:', error);
    } finally {
      setIsLoadingHandle(false);
    }
  };

  if (!paramsReceived) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#390294" />
      </View>
    );
  }

  if (isLoadingHandle) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#390294" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardDismissMode="on-drag" bounces={false}>
      <View style={styles.secondContainer}>
        {forgotPassword ? (
          <View>
            {mailSent ? (
              <>
                {tokenValido ? (
                  <View style={{flex: 1, justifyContent: 'center', flexDirection: 'column', alignItems: 'center', width: '100%', padding: 15}}>
                    <View style={styles.inputContainer}>
                      <View style={styles.labelContainer}>
                        <Text style={styles.label} adjustsFontSizeToFit numberOfLines={2}>Nueva Contraseña:</Text>
                      </View>
                      <TextInput
                        style={styles.input}
                        secureTextEntry={!showFirstPassword}
                        onChangeText={text => setFirstPassword(text)}
                        maxLength={100}
                      />
                      <TouchableOpacity onPress={() => handleShowPassword(setShowFirstPassword, showFirstPassword)} style={styles.eyeIconContainer}>
                        <MaterialCommunityIcons
                          name={showFirstPassword ? 'eye-off' : 'eye'}
                          size={24}
                          color="#575757"
                        />
                      </TouchableOpacity>
                    </View>

                    <View style={styles.inputContainer}>
                      <View style={styles.labelContainer}>
                        <Text style={styles.label} adjustsFontSizeToFit numberOfLines={2}>Repita la contraseña:</Text>
                      </View>
                      <TextInput
                        style={styles.input}
                        secureTextEntry={!showSecondPassword}
                        onChangeText={text => setSecondPassword(text)}
                        maxLength={100}
                      />
                      <TouchableOpacity onPress={() => handleShowPassword(setShowSecondPassword, showSecondPassword)} style={styles.eyeIconContainer}>
                        <MaterialCommunityIcons
                          name={showSecondPassword ? 'eye-off' : 'eye'}
                          size={24}
                          color="#575757"
                        />
                      </TouchableOpacity>
                    </View>

                    <Text style={styles.warningcontrasena}>
                      La contraseña debe tener un mínimo de 8 caracteres e incluir al menos una mayúscula, una minúscula, un número y un caracter especial.
                    </Text>

                    {wrongPasswordType && (
                      <Text style={{ color: 'red', marginBottom: 10 }}>La contraseña introducida no cumple con los requerimientos</Text>
                    )}

                    {differentPassword && (
                      <Text style={{ color: 'red', marginBottom: 10 }}>Las contraseñas no coinciden</Text>
                    )}

                    <TouchableOpacity
                      disabled={isLoadingHandle || !firstPassword || !secondPassword}
                      style={[styles.continueButton, {backgroundColor: (!isLoadingHandle && firstPassword && secondPassword) ? '#390294' : '#6e3aa7'}]}
                      activeOpacity={0.8}
                      onPress={handleSendPassword}
                    >
                      {isLoadingHandle ? (
                        <ActivityIndicator size="small" color='#390294' />
                      ) : (
                        <Text style={styles.continueText}>Confirmar</Text>
                      )}
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
                  </View>
                ) : (
                  <View style={{flex: 1, justifyContent: 'center', flexDirection: 'column', alignItems: 'center', width: '100%', padding: 15}}>
                    <>
                      <Text style={styles.message}>
                        Se ha enviado un código a su correo electrónico. Por favor, introdúzcalo. No olvides revisar tu casilla de SPAM
                      </Text>
                      <View style={styles.inputContainer}>
                        <View style={styles.labelContainer}>
                          <Text style={styles.label}>Código:</Text>
                        </View>
                        <TextInput
                          style={styles.input}
                          onChangeText={text => setTokenPass(text)}
                          maxLength={100}
                          autoCapitalize='none'
                        />
                      </View>

                      {tokenInvalido && (
                        <Text style={{ color: 'red', marginBottom: 10 }}>El código ingresado no es correcto</Text>
                      )}

                      <TouchableOpacity
                        disabled={isLoadingHandle || !tokenPass}
                        style={[styles.continueButton, {backgroundColor: (!isLoadingHandle && tokenPass) ? '#390294' : '#6e3aa7'}]}
                        activeOpacity={0.8}
                        onPress={handleSendToken}
                      >
                        {isLoadingHandle ? (
                          <ActivityIndicator size="small" color='#390294' />
                        ) : (
                          <Text style={styles.continueText}>Continuar</Text>
                        )}
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
                    </>
                  </View>
                )}
              </>
            ) : (
              <View style={{flex: 1, justifyContent: 'center', flexDirection: 'column', alignItems: 'center', width: '100%', padding: 15}}>
                <View style={[styles.inputContainer, {marginBottom: 10}]}>
                  <View style={styles.labelContainer}>
                    <Text style={styles.label}>Usuario:</Text>
                  </View>
                  <TextInput
                    style={styles.input}
                    onChangeText={text => setMail(text)}
                    maxLength={100}
                    autoCapitalize='none'
                  />
                </View>

                <TouchableOpacity
                  disabled={isLoadingHandle || !mail}
                  style={[styles.continueButton, {backgroundColor: (!isLoading && mail) ? '#390294' : '#6e3aa7'}]}
                  activeOpacity={0.8}
                  onPress={handleSendMail}
                >
                  {isLoadingHandle ? (
                    <ActivityIndicator size="small" color='#390294' />
                  ) : (
                    <Text style={styles.continueText}>Continuar</Text>
                  )}
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
              </View>
            )}

          </View>

        ) : (
          <View style={{flex: 1, justifyContent: 'center', flexDirection: 'column', alignItems: 'center', width: '100%', padding: 15}}>
            <View style={styles.inputContainer}>
              <View style={styles.labelContainer}>
                <Text style={styles.label} adjustsFontSizeToFit numberOfLines={2}>Contraseña actual:</Text>
              </View>
              <TextInput
                style={styles.input}
                secureTextEntry={!showOriginalPassword}
                onChangeText={text => setOriginalPassword(text)}
                maxLength={100}
              />
              <TouchableOpacity onPress={() => handleShowPassword(setShowOriginalPassword, showOriginalPassword)} style={styles.eyeIconContainer}>
                <MaterialCommunityIcons
                  name={showOriginalPassword ? 'eye-off' : 'eye'}
                  size={24}
                  color="#575757"
                />
              </TouchableOpacity>
            </View>
            <View style={styles.inputContainer}>
              <View style={styles.labelContainer}>
                <Text style={styles.label} adjustsFontSizeToFit numberOfLines={2}>Nueva Contraseña:</Text>
              </View>
              <TextInput
                style={styles.input}
                secureTextEntry={!showFirstPassword}
                onChangeText={text => setFirstPassword(text)}
                maxLength={100}
              />
              <TouchableOpacity onPress={() => handleShowPassword(setShowFirstPassword, showFirstPassword)} style={styles.eyeIconContainer}>
                <MaterialCommunityIcons
                  name={showFirstPassword ? 'eye-off' : 'eye'}
                  size={24}
                  color="#575757"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.labelContainer}>
                <Text style={styles.label} adjustsFontSizeToFit numberOfLines={2}>Repita la contraseña:</Text>
              </View>
              <TextInput
                style={styles.input}
                secureTextEntry={!showSecondPassword}
                onChangeText={text => setSecondPassword(text)}
                maxLength={100}
              />
              <TouchableOpacity onPress={() => handleShowPassword(setShowSecondPassword, showSecondPassword)} style={styles.eyeIconContainer}>
                <MaterialCommunityIcons
                  name={showSecondPassword ? 'eye-off' : 'eye'}
                  size={24}
                  color="#575757"
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.warningcontrasena}>
              La contraseña debe tener un mínimo de 8 caracteres e incluir al menos una mayúscula, una minúscula, un número y un caracter especial.
            </Text>

            {wrongPasswordType && (
              <Text style={{ color: 'red', marginBottom: 10 }}>La contraseña introducida no cumple con los requerimientos</Text>
            )}

            {samePassword && (
              <Text style={{ color: 'red', marginBottom: 10 }}>La contraseña nueva no puede ser igual a la contraseña actual</Text>
            )}

            {differentPassword && (
              <Text style={{ color: 'red', marginBottom: 10 }}>Las contraseñas no coinciden</Text>
            )}

            <TouchableOpacity
              disabled={isLoadingHandle || !firstPassword || !secondPassword || !originalPassword}
              style={[styles.continueButton, {backgroundColor: (!isLoadingHandle && firstPassword && secondPassword && originalPassword) ? '#390294' : '#6e3aa7'}]}
              activeOpacity={0.8}
              onPress={handleSendPassword}
            >
              {isLoadingHandle ? (
                <ActivityIndicator size="small" color='#390294' />
              ) : (
                <Text style={styles.continueText}>Confirmar</Text>
              )}
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
              onPress={handleForgotPassword}
            >
              <Text style={styles.forgotPswText}>
                ¿Olvidaste tu contraseña?
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
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
  continueButton: {
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
    marginBottom: 10,     
  },
  continueText: {
    fontFamily:'Quicksand-Bold',
    color: '#FFFFFF',           // Color del texto
    fontSize: 16,               // Tamaño del texto
    fontWeight: 'bold',         // Negrita para el texto
    textAlign: 'center',        // Alineación del texto,  
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
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  labelContainer: {
    width: '25%',
  },
  label: {
    //width: 120,
    marginRight: 10,
    fontFamily: 'Quicksand-Bold',
    fontSize: 14,
  },
  input: {
    flex: 1,
    paddingVertical:13,
    borderWidth: 1,
    borderColor: '#505050',
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3, // equivalente a boxShadow en Android para efecto de elevación
    backgroundColor: '#f2f2f2',
    paddingHorizontal: 10,
    fontSize: 14,
    fontFamily: 'Quicksand',
  },
  eyeIconContainer: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -12 }],
  },
  message: {
    fontSize: 14,
    paddingVertical: 10,
    color: '#4f4f4f',
    textAlign: 'center'
  },
  warningcontrasena: {
    fontSize: 10,
    color: '#4f4f4f',
    textAlign: 'center',
    padding: 10
  },
  forgotPswText:{
    fontFamily:'Quicksand',
    color:'#191970',
    alignSelf:'center',
    marginVertical:17
  },
});

export default ChangePasswordScreen;