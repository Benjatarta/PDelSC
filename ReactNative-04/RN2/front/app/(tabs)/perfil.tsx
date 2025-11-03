import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState, useRef } from 'react';
import {Alert, Image, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Linking,
} from 'react-native';
import Toast from 'react-native-toast-message';
import authService, { User } from '../../services/authService';
import { RootStackParamList } from './app';

//recibe el usuario
type Props = NativeStackScreenProps<RootStackParamList, 'Perfil'>;

export default function Perfil({ route, navigation }: Props) {
  const { user: initialUser } = route.params;
  //trabaja con una copia local del usuario para editar sin perder datos del stack
  const [user, setUser] = useState<User>(initialUser);
  const [isEditing, setIsEditing] = useState(true);
  const [formData, setFormData] = useState({
    Nombre: user.Nombre || '',
    Apellido: user.Apellido || '',
    Email: user.Email || '',
    Telefono: user.Telefono || '',
    Direccion: user.Direccion || '',
  });
  const [localPhotoUri, setLocalPhotoUri] = useState<string | null>(null);
  const [localDocument, setLocalDocument] = useState<{ uri: string; name?: string; type?: string } | null>(null);
  const photoInputRef = useRef<any>(null);
  const docInputRef = useRef<any>(null);
  const photoPreviewUrlRef = useRef<string | null>(null);
  const documentPreviewUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      return;
    }

    return () => {
      if (photoPreviewUrlRef.current) {
        URL.revokeObjectURL(photoPreviewUrlRef.current);
        photoPreviewUrlRef.current = null;
      }
      if (documentPreviewUrlRef.current) {
        URL.revokeObjectURL(documentPreviewUrlRef.current);
        documentPreviewUrlRef.current = null;
      }
    };
  }, []);

  //se auto guardan los datos cuando cambian 
  useEffect(() => {
    const autoSave = async () => {
      if (isEditing) {
        try {
          const updatedUser = { ...user, ...formData };
          await authService.updateProfile(updatedUser);
          setUser(updatedUser);
          console.log('Datos auto-guardados:', formData);
        } catch (error) {
          console.error('Error en auto-guardado:', error);
        }
      }
    };

    const timeoutId = setTimeout(autoSave, 1000);
    return () => clearTimeout(timeoutId);
  }, [formData, isEditing, user]);

  useEffect(() => {
    requestPermissions();
    loadSavedData();
  }, []);

  const loadSavedData = async () => {
    try {
      const savedUser = await authService.loadUserFromStorage();
      if (savedUser) {
        setUser(savedUser);
        setFormData({
          Nombre: savedUser.Nombre || '',
          Apellido: savedUser.Apellido || '',
          Email: savedUser.Email || '',
          Telefono: savedUser.Telefono || '',
          Direccion: savedUser.Direccion || '',
        });
        console.log('Datos cargados desde almacenamiento:', savedUser);
      }
    } catch (error) {
      console.error('Error cargando datos:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadSavedData();
    });
    
    const unsubscribeBlur = navigation.addListener('blur', async () => {
      if (isEditing) {
        try {
          const updatedUser = { ...user, ...formData };
          await authService.updateProfile(updatedUser);
          setUser(updatedUser);
          setIsEditing(false);
          Toast.show({ type: 'success', text1: 'Perfil actualizado', text2: 'Tu información se ha guardado' });
        } catch (error) {
          console.error('Error guardando en blur:', error);
        }
      }
    });
    
    return () => {
      unsubscribe();
      unsubscribeBlur();
    };
  }, [navigation, isEditing, formData, user]);

    //cuando salimos,  guardamos cambios pendientes de manera automatica
  const requestPermissions = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: mediaLibraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (cameraStatus !== 'granted' || mediaLibraryStatus !== 'granted') {
      Alert.alert('Permisos', 'Se necesitan permisos de cámara y galería para algunas funciones');
    }
  };
//para tomar una foto, y te muestra opciones en un alert (telefono)
  const handleImagePicker = () => {
    if (Platform.OS === 'web') {
      photoInputRef.current?.click();
      return;
    }
    Alert.alert(
      'Seleccionar foto',
      'Elige una opción',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Cámara', onPress: () => openCamera() },
        { text: 'Galería', onPress: () => openImageLibrary() },
      ]
    );
  };
  //abre la camara
  const openCamera = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        Toast.show({
          type: 'info',
          text1: 'Subiendo foto',
          text2: 'Por favor espera'
        });
        
        try {
          setLocalPhotoUri(result.assets[0].uri);
          //se sube la imagen al backend y actualizamos el perfil guardado
          const serverImageUrl = await authService.uploadProfilePhoto(user.Usuario, result.assets[0].uri);
          
          if (serverImageUrl) {
            const updatedUser = { ...user, foto_perfil: serverImageUrl };
            setUser(updatedUser);
            setLocalPhotoUri(null);
            await authService.updateProfile({ foto_perfil: serverImageUrl });
            Toast.show({
              type: 'success',
              text1: 'Foto actualizada',
              text2: 'Tu foto de perfil se ha subido correctamente'
            });
          }
        } catch (uploadError) {
          console.error('Error al subir foto', uploadError);
          Toast.show({
            type: 'error',
            text1: 'Error al subir',
            text2: 'No se pudo subir la foto al servidor'
          });
          setLocalPhotoUri(null);
        }
      }
    } catch (error) {
      console.error('Error al tomar foto', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No se pudo tomar la foto'
      });
    }
  };
  //abre la galeria
  const openImageLibrary = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        Toast.show({
          type: 'info',
          text1: 'Subiendo foto',
          text2: 'Por favor espera'
        });
        
        try {
          setLocalPhotoUri(result.assets[0].uri);
          //lo mismo que la cámara pero desde la galería
          const serverImageUrl = await authService.uploadProfilePhoto(user.Usuario, result.assets[0].uri);
          
          if (serverImageUrl) {
            const updatedUser = { ...user, foto_perfil: serverImageUrl };
            setUser(updatedUser);
            setLocalPhotoUri(null);
            await authService.updateProfile({ foto_perfil: serverImageUrl });
            Toast.show({
              type: 'success',
              text1: 'Foto actualizada',
              text2: 'Tu foto de perfil se ha subido correctamente'
            });
          }
        } catch (uploadError) {
          console.error('Error al subir foto:', uploadError);
          Toast.show({
            type: 'error',
            text1: 'Error al subir',
            text2: 'No se pudo subir la foto al servidor'
          });
          setLocalPhotoUri(null);
        }
      }
    } catch (error) {
      console.error('Error al seleccionar imagen:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No se pudo seleccionar la imagen'
      });
    }
  };
  //lo mismo que la foto
  const handleDocumentScan = () => {
    if (Platform.OS === 'web') {
      docInputRef.current?.click();
      return;
    }
    Alert.alert(
      'Escanear Documento',
      'Selecciona un documento para escanear',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Tomar Foto', onPress: () => scanWithCamera() },
        { text: 'Seleccionar Archivo', onPress: () => selectDocument() },
      ]
    );
  };

  const scanWithCamera = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.9,
      });

      if (!result.canceled && result.assets[0]) {
        Toast.show({
          type: 'info',
          text1: 'Subiendo documento',
          text2: 'Por favor espera'
        });
        
        try {
          setLocalDocument({ uri: result.assets[0].uri, type: 'image/jpeg' });
          // Subimos la captura como documento asociado al usuario
          const serverDocumentUrl = await authService.uploadDocument(user.Usuario, result.assets[0].uri);
          
          if (serverDocumentUrl) {
            const updatedUser = { ...user, documentos: serverDocumentUrl };
            setUser(updatedUser);
            setLocalDocument(null);
            await authService.updateProfile({ documentos: serverDocumentUrl });
            Toast.show({
              type: 'success',
              text1: 'Documento escaneado',
              text2: 'El documento se ha subido correctamente'
            });
          }
        } catch (uploadError) {
          console.error('Error al subir documento:', uploadError);
          Toast.show({
            type: 'error',
            text1: 'Error al subir',
            text2: 'No se pudo subir el documento al servidor'
          });
          setLocalDocument(null);
        }
      }
    } catch (error) {
      console.error('Error al escanear documento:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No se pudo escanear el documento'
      });
    }
  };

  const selectDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        copyToCacheDirectory: true,
      });

    const doc: any = result;
    if (doc && doc.uri) {
        Toast.show({ type: 'info', text1: 'Subiendo documento', text2: 'Por favor espera' });
        try {
          setLocalDocument({ uri: doc.uri, name: doc.name, type: doc.mimeType });
          const serverDocumentUrl = await authService.uploadDocument(user.Usuario, doc.uri);
          if (serverDocumentUrl) {
            const updatedUser = { ...user, documentos: serverDocumentUrl };
            setUser(updatedUser);
            setLocalDocument(null);
            await authService.updateProfile({ documentos: serverDocumentUrl });
            Toast.show({ type: 'success', text1: 'Documento seleccionado', text2: 'El documento se ha subido correctamente' });
          }
        } catch (uploadError) {
          console.error('Error al subir documento:', uploadError);
          Toast.show({ type: 'error', text1: 'Error al subir', text2: 'No se pudo subir el documento al servidor' });
          setLocalDocument(null);
        }
      }
    } catch (error) {
      console.error('Error al seleccionar documento:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No se pudo seleccionar el documento'
      });
    }
  };

  const onPhotoInputChange = async (event: any) => {
    const file = event?.target?.files && event.target.files[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);

    if (photoPreviewUrlRef.current) {
      URL.revokeObjectURL(photoPreviewUrlRef.current);
    }
    photoPreviewUrlRef.current = objectUrl;
    setLocalPhotoUri(objectUrl);

    try {
      const uploadedUrl = await authService.uploadProfilePhoto(user.Usuario, file);
      if (uploadedUrl) {
        setUser({ ...user, foto_perfil: uploadedUrl });
        setLocalPhotoUri(uploadedUrl);
        if (photoPreviewUrlRef.current) {
          URL.revokeObjectURL(photoPreviewUrlRef.current);
          photoPreviewUrlRef.current = null;
        }
      }
    } catch (error) {
      console.error('Error al subir foto (web):', error);
      Toast.show({ type: 'error', text1: 'Error al subir foto', text2: 'Intenta nuevamente' });
    } finally {
      if (event?.target) {
        event.target.value = '';
      }
    }
  };

  const onDocInputChange = async (event: any) => {
    const file = event?.target?.files && event.target.files[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);

    if (documentPreviewUrlRef.current) {
      URL.revokeObjectURL(documentPreviewUrlRef.current);
    }
    documentPreviewUrlRef.current = objectUrl;
    setLocalDocument({ uri: objectUrl, name: file.name, type: file.type });

    try {
      const uploadedUrl = await authService.uploadDocument(user.Usuario, file);
      if (uploadedUrl) {
        setUser({ ...user, documentos: uploadedUrl });
        setLocalDocument({ uri: uploadedUrl, name: file.name, type: file.type });
        if (documentPreviewUrlRef.current) {
          URL.revokeObjectURL(documentPreviewUrlRef.current);
          documentPreviewUrlRef.current = null;
        }
      }
    } catch (error) {
      console.error('Error al subir documento (web):', error);
      Toast.show({ type: 'error', text1: 'Error al subir documento', text2: 'Intenta nuevamente' });
    } finally {
      if (event?.target) {
        event.target.value = '';
      }
    }
  };
  //para guardar los cambios a pesar del auto guardado
  const handleSaveProfile = async () => {
    try {
      const updatedUser = { ...user, ...formData };
      await authService.updateProfile(updatedUser);
      setUser(updatedUser);
      setIsEditing(false);
      
      Toast.show({
        type: 'success',
        text1: 'Perfil actualizado',
        text2: 'Tu información se guardó correctamente'
      });
    } catch (error) {
      console.error('Error al guardar perfil:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No se pudo guardar la información'
      });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Mi perfil</Text>
      </View>

      <View style={styles.profileSection}>
        {Platform.OS === 'web' && (
          <>
            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={onPhotoInputChange}
            />
            <input
              ref={docInputRef}
              type="file"
              accept="image/*,application/pdf"
              style={{ display: 'none' }}
              onChange={onDocInputChange}
            />
          </>
        )}

        <TouchableOpacity onPress={handleImagePicker} style={styles.imageContainer}>
          {localPhotoUri ? (
            <Image source={{ uri: localPhotoUri }} style={styles.profileImage} />
          ) : user.foto_perfil ? (
            <Image source={{ uri: user.foto_perfil }} style={styles.profileImage} />
          ) : (
            <View style={styles.profileImagePlaceholder}>
              <Ionicons name="person" size={50} color="#ccc" />
            </View>
          )}
          <View style={styles.imageOverlay}>
            <Ionicons name="camera" size={24} color="white" />
          </View>
        </TouchableOpacity>
        <Text style={styles.userName}>{user.Nombre || user.Usuario}</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.field}>
          <Text style={styles.label}>Usuario</Text>
          <TextInput
            style={[styles.input, styles.disabledInput]}
            value={user.Usuario}
            editable={false}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Nombre</Text>
          <TextInput
            style={[styles.input, !isEditing && styles.disabledInput]}
            value={formData.Nombre}
            onChangeText={(text) => setFormData(prev => ({ ...prev, Nombre: text }))}
            editable={isEditing}
            placeholder="Ingresa tu nombre"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Apellido</Text>
          <TextInput
            style={[styles.input, !isEditing && styles.disabledInput]}
            value={formData.Apellido}
            onChangeText={(text) => setFormData(prev => ({ ...prev, Apellido: text }))}
            editable={isEditing}
            placeholder="Ingresa tu apellido"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, !isEditing && styles.disabledInput]}
            value={formData.Email}
            onChangeText={(text) => setFormData(prev => ({ ...prev, Email: text }))}
            editable={isEditing}
            placeholder="Ingresa tu email"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Teléfono</Text>
          <TextInput
            style={[styles.input, !isEditing && styles.disabledInput]}
            value={formData.Telefono}
            onChangeText={(text) => setFormData(prev => ({ ...prev, Telefono: text }))}
            editable={isEditing}
            placeholder="Ingresa tu teléfono"
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Dirección</Text>
          <TextInput
            style={[styles.input, styles.addressInput, !isEditing && styles.disabledInput]}
            value={formData.Direccion}
            onChangeText={(text) => setFormData(prev => ({ ...prev, Direccion: text }))}
            editable={isEditing}
            placeholder="Ingresa tu dirección"
            multiline
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Documento</Text>
          <TouchableOpacity onPress={handleDocumentScan} style={styles.documentButton}>
            <Ionicons name="document-text" size={24} color="#007bff" />
            <Text style={styles.documentButtonText}>
              {user.documentos ? 'Documento escaneado' : 'Escanear documento'}
            </Text>
            <Ionicons name="camera" size={20} color="#007bff" />
          </TouchableOpacity>
          {localDocument ? (
            localDocument.type && localDocument.type.includes('pdf') ? (
              <TouchableOpacity onPress={() => Linking.openURL(localDocument.uri)}>
                <Text style={styles.documentLink}>{localDocument.name || 'Ver documento'}</Text>
              </TouchableOpacity>
            ) : (
              <Image source={{ uri: localDocument.uri }} style={styles.documentPreview} />
            )
          ) : user.documentos ? (
            user.documentos.toLowerCase().endsWith('.pdf') ? (
              <TouchableOpacity onPress={() => Linking.openURL(user.documentos!)}>
                <Text style={styles.documentLink}>Ver documento</Text>
              </TouchableOpacity>
            ) : (
              <Image source={{ uri: user.documentos }} style={styles.documentPreview} />
            )
          ) : null}
        </View>

        {isEditing && (
          <TouchableOpacity onPress={handleSaveProfile} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Guardar cambios</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileSection: {
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 30,
    marginBottom: 20,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#007bff',
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  userProvider: {
    fontSize: 14,
    color: '#666',
    textTransform: 'capitalize',
  },
  form: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 10,
    padding: 20,
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  disabledInput: {
    backgroundColor: '#f8f9fa',
    color: '#666',
  },
  addressInput: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  documentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f8f9fa',
  },
  documentButtonText: {
    fontSize: 16,
    color: '#007bff',
    flex: 1,
    marginLeft: 10,
  },
  documentPreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 10,
    resizeMode: 'cover',
  },
  documentLink: {
    marginTop: 10,
    color: '#007bff',
    textDecorationLine: 'underline',
  },
  saveButton: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});