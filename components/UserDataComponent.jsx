import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const UserDataComponent = ({ setUsername, setPassword, setEmail, setBirthday, initialUsername, initialEmail, initialBirthday, editing, fromScreen }) => {
  const today = new Date();
  const maximumDate = new Date(today.getFullYear() - 15, today.getMonth(), today.getDate() - 1);
  const initialBirthdayDate = initialBirthday ? new Date(initialBirthday) : null;
  const initialEmailText = initialEmail;

  const [showDatePicker, setShowDatePicker] = useState(false); // Estado para mostrar u ocultar el DatePicker
  const [selectedDate, setSelectedDate] = useState(initialBirthdayDate ? initialBirthdayDate : maximumDate); // Estado para almacenar la fecha seleccionada
  const [newEmail, setNewEmail] = useState(initialEmailText ? initialEmailText : '')
  const [showPassword, setShowPassword] = useState(false);

  const [isCambiarContrasenaLoading, setIsCambiarContrasenaLoading] = useState(false);

  const navigation = useNavigation();

  // Función para manejar el cambio de fecha seleccionada
  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setSelectedDate(currentDate);
    const formattedDate = format(currentDate, 'yyyy-MM-dd'); // Formato 'yyyy-MM-dd'
    setBirthday(formattedDate);
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword); // Cambia entre mostrar y ocultar la contraseña
  };

  const handleCambiarContrasena = () => {
    navigation.navigate('changepassword', { forgotten: false })
  }

  const handleEmailChange = (value) => {
    setNewEmail(value);
    setEmail(value);
  }


  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        {editing ? (
          <Text  style={{fontFamily: 'Quicksand-Bold', fontSize: 14, marginBottom: 20}}>
           {initialUsername}
          </Text>
        ) : (
          <>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>Usuario:</Text>
          </View>      
          <TextInput
            style={styles.input}
            onChangeText={text => setUsername(text)}
            maxLength={25}
          />
          </>
        )}
      </View>
      <View style={styles.inputContainer}>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>Email:</Text>
        </View>
        <TextInput
          value={newEmail}
          style={styles.input}
          keyboardType='email-address'
          onChangeText={text => handleEmailChange(text)}
          maxLength={100}
          autoCapitalize='none'
          autoCorrect={false}
          autoComplete='off'

        />
      </View>
      <TouchableOpacity style={styles.inputContainer} onPress={() => setShowDatePicker(!showDatePicker)}>
        <View style={[styles.inputContainer, {marginBottom: 0}]}>
          <View style={styles.labelContainer}>
            <Text style={styles.label} adjustsFontSizeToFit numberOfLines={2}>Fecha de nacimiento:</Text>
          </View>
          <TextInput
            style={[styles.input, {textAlign: 'center'}]}
            editable={false}
            onPress={() => setShowDatePicker(!showDatePicker)}
            value={selectedDate.toLocaleDateString()}
          />
          {/* <Text style={styles.inputFecha}>{selectedDate.toLocaleDateString()}</Text> */}
        </View>
      </TouchableOpacity>
      {showDatePicker && (
        <View>
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="spinner"
            onChange={handleDateChange}
            maximumDate={maximumDate}
            minimumDate={new Date(1900, 0, 2)}
          />
          <TouchableOpacity onPress={() => setShowDatePicker(false)}>
            <Text style={styles.closeDatePickerButton}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.inputContainer}>
        {editing ? (
          <TouchableOpacity
            disabled={isCambiarContrasenaLoading}
            //style={styles.cambiarContrasenaButton}
            activeOpacity={0.8}
            onPress={handleCambiarContrasena}
          >
            {/* {isCambiarContrasenaLoading ?
              <ActivityIndicator size="small" color='#390294' /> :
              <Text style={styles.cambiarContrasenaText}>Cambiar Contraseña</Text>
            } */}
            <View style={{marginVertical: 10}}>
              <Text style={styles.cambiarContrasenaText}>Cambiar Contraseña</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <>
            <View style={styles.labelContainer}>
              <Text style={styles.label} adjustsFontSizeToFit numberOfLines={1}>Contraseña:</Text>
            </View>
            <TextInput
              style={styles.input}
              secureTextEntry={!showPassword}
              onChangeText={text => setPassword(text)}
              maxLength={100}
            />
            <TouchableOpacity onPress={handleShowPassword} style={styles.eyeIconContainer}>
              <MaterialCommunityIcons
                name={showPassword ? 'eye-off' : 'eye'}
                size={24}
                color="#575757"
              />
            </TouchableOpacity>
          </>
        )}
      </View>
      {!editing && (
        <View>
          <Text style={styles.warningcontrasena}>
            La contraseña debe tener un mínimo de 8 caracteres e incluir al menos una mayúscula, una minúscula, un número y un caracter especial.
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 15,
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
  inputFecha: {
    flex: 1,
    //width: 220,
    height: 30,
    borderWidth: 1,
    borderColor: '#505050',
    //borderRadius: 25,
    fontFamily: 'Quicksand',
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    textAlign: 'center',
    fontSize: 16,
  },
  warningcontrasena: {
    fontSize: 10,
    paddingVertical: 5,
    color: '#4f4f4f'
  },
  closeDatePickerButton: {
    fontSize: 16,
    color: '#390294',
    alignSelf: 'flex-end',
    fontFamily: 'Quicksand-Bold',
    marginBottom: 20,
  },
  eyeIconContainer: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -12 }],
  },
  cambiarContrasenaButton: {
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
  cambiarContrasenaText: {
    color: '#191970',           // Color del texto
    fontSize: 16,               // Tamaño del texto
    textAlign: 'center',
    fontFamily: 'Quicksand-Bold'
  },
});

export default UserDataComponent;
