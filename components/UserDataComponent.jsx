import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const UserDataComponent = () => {
    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');
    const [email,setEmail] = useState('');
    const [age,setAge] = useState('');

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Usuario:</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={text => setUsername(text)}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email:</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={text => setEmail(text)}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Edad:</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={age}
          onChangeText={text => setAge(text)}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Contraseña:</Text>
        <TextInput
          style={styles.input}
          secureTextEntry={true}
          value={password}
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
    width: 83,
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
    fontFamily: 'Quicksand-Regular',
    backgroundColor: '#f9f9f9',
  },
});

export default UserDataComponent;
