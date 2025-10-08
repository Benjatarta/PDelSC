import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AgregarUsuario from './index';
import Toast from 'react-native-toast-message';
import NuevoTab from './nuevo';
import Registro from './registro';


export type RootStackParamList = {
  Agregar: undefined;
  Bienvenida: { usuario: string };
  Registro: undefined; 
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
      </Stack.Navigator>
      <Toast />
    </NavigationContainer>
  );
}