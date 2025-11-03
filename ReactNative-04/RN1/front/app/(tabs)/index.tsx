import React, { useState, useRef } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import Toast from 'react-native-toast-message';
import axios from 'axios';

export default function AgregarUsuario({ navigation }: any) {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [errores, setErrores] = useState<Record<string, string>>({});
  const passwordInputRef = useRef<TextInput>(null);

  const validar = () => {
    const nuevosErrores: Record<string, string> = {};

    if (!usuario.trim()) nuevosErrores.usuario = 'El usuario es obligatorio';
    else if (usuario.trim().length < 3)
      nuevosErrores.usuario = 'El usuario debe tener al menos 3 caracteres';
    else if (/^\d+$/.test(usuario.trim()))
      nuevosErrores.usuario = 'El usuario debe contener al menos una letra';

    if (!password.trim()) nuevosErrores.password = 'La contraseña es obligatoria';
    else if (password.trim().length < 6)
      nuevosErrores.password = 'La contraseña debe tener al menos 6 caracteres';

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async () => {
    if (!validar()) {
      return;
    }
  
    try {
      const response = await axios.post<{ success: boolean }>('http://192.168.100.134:3001/login', {
        Usuario: usuario.trim(),
        Password: password.trim(),
      });
  
      console.log("Respuesta del servidor:", response.data);
  
      if (response.data && response.data.success === true) {
        navigation.navigate('Bienvenida', {
          usuario: usuario.trim(),
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Usuario no encontrado',
          text2: 'Por favor regístrate primero',
          text2Style: { fontSize: 14},
          visibilityTime: 3000,
          position: 'top'
        });
      }
    } catch (error: any) {
      console.error("Error de conexión:", error.message);
      Toast.show({
        type: 'error',
        text1: 'Error de conexión',
        text2: 'No se pudo conectar al servidor'
      });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Iniciar Sesión</Text>

      <View style={styles.field}>
        <Text style={styles.label}>Usuario</Text>
        <TextInput
          style={[styles.input, errores.usuario && styles.inputError]}
          value={usuario}
          onChangeText={setUsuario}
          returnKeyType="next"
          autoCapitalize="none"
          onSubmitEditing={() => {
            passwordInputRef.current && passwordInputRef.current.focus();
          }}
        />
        {errores.usuario && <Text style={styles.errorText}>{errores.usuario}</Text>}
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          ref={passwordInputRef}
          style={[styles.input, errores.password && styles.inputError]}
          value={password}
          onChangeText={setPassword}
          returnKeyType="done"
          secureTextEntry
          autoCapitalize="none"
          onSubmitEditing={handleSubmit}
        />
        {errores.password && <Text style={styles.errorText}>{errores.password}</Text>}
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Ingresar" onPress={handleSubmit} color="#007bff" />
        <Button
          title="No estás registrado, regístrate"
          onPress={() => navigation.navigate('Registro')}
          color="#28a745"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f6fa',
  },
  titulo: {
    fontSize: 28,
    textAlign: 'center',
    fontWeight: 'bold',
    marginVertical: 20,
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: 'white',
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginTop: 4,
  },
  buttonContainer: {
    marginTop: 20,
  },
});