import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const UserDataComponent = ({ setUsername, setPassword, setEmail, setBirthdate }) => {
  const [showDatePicker, setShowDatePicker] = useState(false); // Estado para mostrar u ocultar el DatePicker
  const [selectedDate, setSelectedDate] = useState(new Date()); // Estado para almacenar la fecha seleccionada

  // Función para manejar el cambio de fecha seleccionada
const handleDateChange = (event, selectedDate) => {
  const currentDate = selectedDate || date;
  setShowDatePicker(false);
  setSelectedDate(currentDate);
  // const isoDate = currentDate.toISOString(); 
  // setBirthdate(isoDate); 
  // setBirthdate('2000/07/11');
};


  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Usuario:</Text>
        <TextInput
          style={styles.input}
          onChangeText={text => setUsername(text)}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email:</Text>
        <TextInput
          style={styles.input}
          onChangeText={text => setEmail(text)}
        />
      </View>
      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Fecha de nacimiento:</Text>
          <Text style={styles.inputFecha}>{selectedDate.toLocaleDateString()}</Text>
        </View>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="spinner"
          onChange={handleDateChange}
        />
      )}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Contraseña:</Text>
        <TextInput
          style={styles.input}
          secureTextEntry={true}
          onChangeText={text => setPassword(text)}
        />
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
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    width: 120,
    marginRight: 10,
    fontFamily: 'Quicksand-Bold'
  },
  input: {
    flex: 1,
    height: 30,
    borderWidth: 1,
    borderColor: '#505050',
    borderRadius: 25,
    paddingHorizontal: 10,
    fontFamily: 'Quicksand',
    backgroundColor: '#f9f9f9',
  },
  inputFecha: {
    // flex: 1,
    width: 220,
    height: 30,
    borderWidth: 1,
    borderColor: '#505050',
    // borderRadius: 25,
    fontFamily: 'Quicksand',
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    textAlign: 'center',
    fontSize: 16,
  },
});

export default UserDataComponent;
