import React, { useRef, useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/Ionicons';
import authService from '../../services/authService';

export default function Registro({ navigation }: any) {
    const [usuario, setUsuario] = useState('');
    const [password, setPassword] = useState('');
    const [confirmarPassword, setConfirmarPassword] = useState('');
    const [errores, setErrores] = useState<Record<string, string>>({});
    const passwordInputRef = useRef<TextInput>(null);
    const confirmarPasswordInputRef = useRef<TextInput>(null);
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
    else if (password.trim().length > 20)
    nuevosErrores.password = 'La contraseña debe tener como máximo 20 caracteres';

    if (!confirmarPassword.trim()) nuevosErrores.confirmarPassword = 'Debes confirmar la contraseña';
    else if (confirmarPassword.trim().length > 20)
    nuevosErrores.confirmarPassword = 'La contraseña debe tener como máximo 20 caracteres';
    else if (password !== confirmarPassword)
    nuevosErrores.confirmarPassword = 'Las contraseñas no coinciden';

        setErrores(nuevosErrores);
        return Object.keys(nuevosErrores).length === 0;
    };
    //registra si cumple con la validacion
    const handleRegistro = async () => {
        if (!validar()) {
        return;
        }

        try {
        console.log("Enviando registro al backend...", { usuario: usuario.trim(), password: "***" });
        const user = await authService.signUpWithCredentials(usuario.trim(), password.trim());
        
        console.log("Respuesta del registro:", user);
        
        if (user) {
            Toast.show({
                type: 'success',
                text1: 'Éxito',
                text2: 'Usuario registrado correctamente, redirigiendo',
                text2Style: { fontSize: 14},
                visibilityTime: 2500,
                position: 'top'
            });
            
            setTimeout(() => {
                navigation.navigate('Agregar');
            }, 2000);
        } else {
            Toast.show({
                type: 'error',
                text1: 'Error en el registro',
                text2: 'No se pudo registrar el usuario. Verifica los datos.'
            });
        }
        } catch (error: any) {
        console.error("Error al registrar:", error);
        console.error("Error response:", error.response?.data);
        Toast.show({
            type: 'error',
            text1: 'Error de conexión',
            text2: error.response?.data?.error || 'No se pudo conectar al servidor'
        });
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity
            onPress={() => navigation.navigate('Agregar')}
            style={{
            position: 'absolute',
            top: 40,
            left: 20,
            zIndex: 10,
            padding: 5
            }}
        >
            <Icon name="arrow-back" size={28} color="#333" />
        </TouchableOpacity>
        
        <Text style={styles.titulo}>Registro de Usuario</Text>

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
            returnKeyType="next"
            secureTextEntry
            autoCapitalize="none"
            maxLength={20}
            onSubmitEditing={() => {
                confirmarPasswordInputRef.current && confirmarPasswordInputRef.current.focus();
            }}
            />
            {errores.password && <Text style={styles.errorText}>{errores.password}</Text>}
        </View>

        <View style={styles.field}>
            <Text style={styles.label}>Confirmar Contraseña</Text>
            <TextInput
            ref={confirmarPasswordInputRef}
            style={[styles.input, errores.confirmarPassword && styles.inputError]}
            value={confirmarPassword}
            onChangeText={setConfirmarPassword}
            returnKeyType="done"
            secureTextEntry
            autoCapitalize="none"
            maxLength={20}
            onSubmitEditing={handleRegistro}
            />
            {errores.confirmarPassword && <Text style={styles.errorText}>{errores.confirmarPassword}</Text>}
        </View>

        <View style={styles.buttonContainer}>
            <Button title="Registrar" onPress={handleRegistro} color="#007bff" />
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