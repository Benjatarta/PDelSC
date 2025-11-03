import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { Button, Image, Platform, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import authService, { User } from '../../services/authService';
import { RootStackParamList } from './app';

type Props = NativeStackScreenProps<RootStackParamList, 'Bienvenida'>;

export default function NuevoTab({ route, navigation }: Props) {
  const { usuario, user: routeUser } = route.params;
  const [user, setUser] = useState<User | null>(routeUser || null);
  const { width } = useWindowDimensions();
  const isCompact = width < 480;

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    // El storage local permite mantener la sesion aun si se reabre la app
    const storedUser = await authService.loadUserFromStorage();
    if (storedUser) {
      setUser(storedUser);
      console.log('Datos de usuario cargados en pantalla principal', storedUser);
    }
  };

  //recarga datos cuando se regresa a esta pantalla
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadUserData();
    });
    
    return unsubscribe;
  }, [navigation]);

  const handleLogout = async () => {
    // Limpiamos storage y volvemos al login
    await authService.signOut();
    navigation.navigate('Agregar');
  };

  const handleGoToProfile = () => {
    if (user) {
      navigation.navigate('Perfil', { user });
    }
  };

  const renderProfileImage = () => {
    if (user?.foto_perfil) {
      return (
        <Image source={{ uri: user.foto_perfil }} style={styles.profileImage} />
      );
    }
    return (
      <View style={styles.profileImagePlaceholder}>
        <Ionicons name="person" size={40} color="#ccc" />
      </View>
    );
  };

  const greetingName = user?.Nombre || usuario;
  const provider = user?.autenticacion && user.autenticacion !== 'local'
    ? `Conectado con ${user.autenticacion}`
    : null;

  return (
    <View style={[styles.container, isCompact && styles.containerCompact]}>
      <View style={[styles.heroWrapper, isCompact && styles.heroWrapperCompact]}>
        <View style={[styles.heroCard, isCompact && styles.heroCardCompact]}>
          <TouchableOpacity
            onPress={handleGoToProfile}
            style={[styles.heroInfo, isCompact && styles.heroInfoCompact]}
          >
            {renderProfileImage()}
            <View style={[styles.userInfo, isCompact && styles.userInfoCompact]}>
              <Text style={[styles.welcomeText, isCompact && styles.centerText]}>Bienvenido!</Text>
              <Text style={[styles.userName, isCompact && styles.centerText]}>
                {`Hola ${greetingName}!`}
              </Text>
              {provider && (
                <Text style={[styles.providerText, isCompact && styles.centerText]}>{provider}</Text>
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleGoToProfile}
            style={[styles.editButton, isCompact && styles.editButtonCompact]}
          >
            <Ionicons name="create-outline" size={20} color="#309b50ff" />
            <Text style={styles.editButtonText}>Editar perfil</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.content, isCompact && styles.contentCompact]} />

      <View style={[styles.footer, isCompact && styles.footerCompact]}>
        <Button title="Cerrar sesión" onPress={handleLogout} color="#d9534f" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
    paddingTop: Platform.OS === 'ios' ? 70 : 50,
    paddingBottom: Platform.OS === 'ios' ? 50 : 40,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  containerCompact: {
    paddingHorizontal: 16,
  },
  heroWrapper: {
    marginBottom: 36,
    width: '100%',
    maxWidth: 800,
    alignSelf: 'center',
  },
  heroWrapperCompact: {
    maxWidth: 480,
  },
  heroCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    width: '100%',
  },
  heroCardCompact: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 24,
  },
  heroInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  heroInfoCompact: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 20,
  },
  profileImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
  },
  userInfo: {
    flex: 1,
  },
  userInfoCompact: {
    alignItems: 'center',
    marginTop: 12,
  },
  welcomeText: {
    fontSize: 18,
    color: '#666',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 6,
  },
  providerText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  centerText: {
    textAlign: 'center',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#e8f5ed',
    borderWidth: 1,
    borderColor: '#d2eadb',
  },
  editButtonCompact: {
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  editButtonText: {
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '600',
    color: '#1c6b39',
  },
  content: {
    height: 48,
  },
  contentCompact: {
    height: 32,
  },
  footer: {
    alignItems: 'stretch',
    marginTop: 48,
    width: '100%',
    maxWidth: 800,
    alignSelf: 'center',
  },
  footerCompact: {
    maxWidth: 480,
    marginTop: 32,
  },
});