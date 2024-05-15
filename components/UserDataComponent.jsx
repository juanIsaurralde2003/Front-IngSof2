import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';

const UserDataComponent = ({ setUsername, setPassword, setEmail, setBirthday }) => {
  const [showDatePicker, setShowDatePicker] = useState(false); // Estado para mostrar u ocultar el DatePicker
  const [selectedDate, setSelectedDate] = useState(new Date()); // Estado para almacenar la fecha seleccionada
  const [timeoutFecha, setTimeoutFecha] = useState(null);

  // Función para manejar el cambio de fecha seleccionada
const handleDateChange = (event, selectedDate) => {
  if (timeoutFecha) {
    clearTimeout(timeoutFecha);
  }
  const currentDate = selectedDate || date;
  setSelectedDate(currentDate);
  const formattedDate = format(currentDate, 'yyyy-MM-dd'); // Formato 'yyyy-MM-dd'
  setBirthday(formattedDate);
  const newTimeoutFecha = setTimeout(() => {
    setShowDatePicker(false);
  }, 2000); // 2000 milisegundos = 2 segundos
  setTimeoutFecha(newTimeoutFecha);
};


  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>Usuario:</Text>
        </View>      
        <TextInput
          style={styles.input}
          onChangeText={text => setUsername(text)}
          maxLength={25}
        />
      </View>
      <View style={styles.inputContainer}>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>Email:</Text>
        </View>
        <TextInput
          style={styles.input}
          keyboardType='email-address'
          onChangeText={text => setEmail(text)}
        />
      </View>
      <TouchableOpacity style={styles.inputContainer} onPress={() => setShowDatePicker(true)}>
        <View style={[styles.inputContainer, {marginBottom: 0}]}>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>Fecha de nacimiento:</Text>
          </View>
          <TextInput
            style={[styles.input, {textAlign: 'center'}]}
            editable={false}
            onPress={() => setShowDatePicker(true)}
            value={selectedDate.toLocaleDateString()}
          />
          {/* <Text style={styles.inputFecha}>{selectedDate.toLocaleDateString()}</Text> */}
        </View>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="spinner"
          onChange={handleDateChange}
          maximumDate={new Date()}
        />
      )}
      <View style={styles.inputContainer}>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>Contraseña:</Text>
        </View>
        <TextInput
          style={styles.input}
          secureTextEntry={true}
          onChangeText={text => setPassword(text)}
        />
      </View>
      <View>
        <Text style={styles.warningcontrasena}>
          La contraseña debe tener un mínimo de 8 caracteres e incluir al menos una mayúscula, una minúscula, un número y un caracter especial.
        </Text>
      </View>
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
  }
});

export default UserDataComponent;
