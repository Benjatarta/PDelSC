import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import Toast from 'react-native-toast-message';
import { User } from '../../services/authService';
import AgregarUsuario from './index';
import NuevoTab from './nuevo';
import Perfil from './perfil';
import Registro from './registro';


export type RootStackParamList = {
  Agregar: undefined;
  Bienvenida: { usuario: string; user?: User };
  Registro: undefined; 
  Perfil: { user: User };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Agregar" screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="Agregar"
          component={AgregarUsuario}
        />
        <Stack.Screen
          name="Bienvenida"
          component={NuevoTab}
        />
        <Stack.Screen
          name="Registro"
          component={Registro}
        />
        <Stack.Screen
          name="Perfil"
          component={Perfil}
        />
      </Stack.Navigator>
      <Toast />
    </NavigationContainer>
  );
}