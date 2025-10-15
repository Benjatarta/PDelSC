import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import authService from '../../services/authService';

export default function AgregarUsuario({ navigation }: any) {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [errores, setErrores] = useState<Record<string, string>>({});
  const passwordInputRef = useRef<TextInput>(null);

  useEffect(() => {
    const checkOAuthReturn = async () => {
      try {
        //cuando volvemos de la web revisamos si google envio credenciales
        const user = await authService.handleOAuthCallback();
        if (user) {
          console.log('Usuario autenticado via OAuth:', user);
          Toast.show({
            type: 'success',
            text1: 'Bienvenido!',
            text2: `Conectado con Google como ${user.Nombre}`,
            visibilityTime: 3000
          });
          navigation.navigate('Bienvenida', {
            usuario: user.Usuario,
            user: user,
          });
        }
      } catch (error) {
        console.error('Error procesando OAuth', error);
        Toast.show({
          type: 'error',
          text1: 'Error OAuth',
          text2: 'Hubo un problema con la autenticación',
          visibilityTime: 3000
        });
      }
    };

    checkOAuthReturn();
  }, [navigation]);
  //validacion
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
      //login tradicional 
      const user = await authService.signInWithCredentials(usuario.trim(), password.trim());
      
      if (user) {
        navigation.navigate('Bienvenida', {
          usuario: user.Usuario,
          user: user,
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
  //login de google
  const handleGoogleLogin = async () => {
    try {
      console.log('Iniciando Google OAuth.');
      const user = await authService.signInWithGoogle();
      if (user) {
        console.log('Google OAuth exitoso', user);
        Toast.show({
          type: 'success',
          text1: 'Bienvenido!',
          text2: `Conectado con Google como ${user.Nombre}`,
          visibilityTime: 3000
        });
        navigation.navigate('Bienvenido', {
          usuario: user.Usuario,
          user: user,
        });
      }
    } catch (error: any) {
      console.error('Error en Google OAuth:', error);
      const rawMessage = error?.message || String(error);

      Toast.show({
        type: 'error',
        text1: 'Error con Google',
        text2: rawMessage,
        visibilityTime: 5000
      });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Iniciar sesión</Text>

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
        
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>O continúa con</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.socialButtons}>
          <TouchableOpacity style={[styles.socialButton, styles.googleButton]} onPress={handleGoogleLogin}>
            <Ionicons name="logo-google" size={24} color="white" />
            <Text style={styles.socialButtonText}>Google</Text>
          </TouchableOpacity>
        </View>
        
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
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#666',
    fontSize: 14,
  },
  socialButtons: {
    gap: 12,
    marginBottom: 20,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  socialButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  googleButton: {
    backgroundColor: '#db4437',
  },
  facebookButton: {
    backgroundColor: '#4267B2',
  },
  appleButton: {
    backgroundColor: '#000000',
  },
});