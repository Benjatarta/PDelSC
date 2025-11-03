import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as AuthSession from 'expo-auth-session';
import { AuthRequest, Prompt, ResponseType } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
//limpia el estado del navegador
WebBrowser.maybeCompleteAuthSession();
//host a la api
const BASE_URL = 'http://192.168.100.60:3001';

//coincide con todo de la base de datos
export interface User {
  Id?: number;
  Usuario: string;
  Email?: string;
  Nombre?: string;
  Apellido?: string;
  foto_perfil?: string;
  Telefono?: string;
  Direccion?: string;
  documentos?: string;
  autenticacion: 'local' | 'google' | 'facebook' | 'apple';
}

class AuthService {
  private user: User | null = null;

  //configuración OAuth
  private googleConfig = {
    clientId: '582233369139-c0bjg5il7og2ocng7lu9f00d55cv3phc.apps.googleusercontent.com', 
    scopes: ['profile', 'email'],
    additionalParameters: {},
    customParameters: {},
  };

  //se manejan parametros OAuth del callback
  async handleOAuthCallback(): Promise<User | null> {
    try {
      if (Platform.OS !== 'web') return null;

      //verifica si hay un token OAuth en el hash
      if (window.location.hash.includes('access_token')) {
        console.log('Token OAuth encontrado en hash');
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        
        if (accessToken) {
          //limpia la url
          window.history.replaceState({}, document.title, window.location.pathname);
          
          //obtiene informacion del usuario de google
          const userResponse = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`);
          const userData = await userResponse.json();

          console.log('Datos del usuario de Google:', userData);

          //procesa la respuesta OAuth
          const nameParts = userData.name?.split(' ') || [''];
          const nombre = nameParts[0] || '';
          const apellido = nameParts.slice(1).join(' ') || '';

          return await this.processOAuthData({
            usuario: userData.email,
            email: userData.email,
            nombre,
            apellido,
            fotoPerfil: userData.picture || '',
            autenticacion: 'google'
          });
        }
      }

      const urlParams = new URLSearchParams(window.location.search);
      
      if (urlParams.get('oauth_error')) {
        throw new Error('Error en autenticación OAuth');
      }

      if (urlParams.get('oauth_success')) {
        const oauthData = {
          id: urlParams.get('oauth_id'),
          email: urlParams.get('oauth_email'),
          name: urlParams.get('oauth_name'),
          picture: urlParams.get('oauth_picture')
        };

    console.log('OAuth callback recibido:', oauthData);

        //limppa la url
        window.history.replaceState({}, document.title, window.location.pathname);

        //procesa datos OAuth
        if (oauthData.email && oauthData.name) {
          const nameParts = oauthData.name.split(' ');
          const nombre = nameParts[0] || '';
          const apellido = nameParts.slice(1).join(' ') || '';

          return await this.processOAuthData({
            usuario: oauthData.email,
            email: oauthData.email,
            nombre,
            apellido,
            fotoPerfil: oauthData.picture || '',
            autenticacion: 'google'
          });
        }
      }

      return null;
    } catch (error) {
  console.error('Error en handleOAuthCallback:', error);
      throw error;
    }
  }

  //metodos para subir archivos
  async uploadProfilePhoto(usuario: string, imageSource: any): Promise<string | null> {
    try {
    console.log('Subiendo foto de perfil...', typeof imageSource === 'string' ? imageSource : '[object]');
      
      //crea el formData
      const formData = new FormData();
      formData.append('usuario', usuario);
      
      this.appendFileToFormData(formData, 'foto_perfil', imageSource, 'profile.jpg', 'image/jpeg');
      
      const uploadResponse = await axios.post(`${BASE_URL}/upload-profile-photo`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('Foto de perfil subida:', uploadResponse.data);
      const foto = (uploadResponse.data as any).foto_perfil;
      return this.normalizeFileUrl(foto);
      
    } catch (error) {
  console.error('Error al subir foto de perfil:', error);
      throw error;
    }
  }
//lo mismo que el de la foto
  async uploadDocument(usuario: string, documentSource: any): Promise<string | null> {
    try {
    console.log('Subiendo documento...', typeof documentSource === 'string' ? documentSource : '[object]');
      
      //crea el formData
      const formData = new FormData();
      formData.append('usuario', usuario);
      
      this.appendFileToFormData(formData, 'documento', documentSource, 'document.pdf', 'application/pdf');
      
      const uploadResponse = await axios.post(`${BASE_URL}/upload-document`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('Documento subido:', uploadResponse.data);
      const doc = (uploadResponse.data as any).documentos;
      return this.normalizeFileUrl(doc);
      
    } catch (error) {
  console.error('Error al subir documento:', error);
      throw error;
    }
  }

  private normalizeFileUrl(value?: string | null): string | null {
    if (!value) {
      return null;
    }

    try {
      const base = new URL(BASE_URL);

      if (value.startsWith('http://') || value.startsWith('https://')) {
        const parsed = new URL(value);
        // Si el host difiere del backend, reusamos el host de BASE_URL
        if (parsed.hostname !== base.hostname || parsed.port !== base.port || parsed.protocol !== base.protocol) {
          parsed.hostname = base.hostname;
          parsed.port = base.port;
          parsed.protocol = base.protocol;
        }
        return parsed.toString();
      }

      const cleaned = value.replace(/^\/+/, '');
      return `${BASE_URL.replace(/\/$/, '')}/${cleaned}`;
    } catch (error) {
      console.warn('No se pudo normalizar la URL del archivo:', value, error);
      return value;
    }
  }

  private appendFileToFormData(
    formData: FormData,
    fieldName: string,
    source: any,
    defaultFileName: string,
    defaultMimeType: string,
  ): void {
    if (!source) {
      throw new Error(`Fuente no válida para ${fieldName}`);
    }

    const FileCtor = typeof File !== 'undefined' ? File : undefined;
    if (FileCtor && source instanceof FileCtor) {
      formData.append(fieldName, source, source.name || defaultFileName);
      return;
    }

    const candidateName = source?.name as string | undefined;
    const candidateType = source?.type as string | undefined;
    const uri = typeof source === 'string' ? source : source?.uri;

    if (uri) {
      const name = candidateName || this.ensureExtension(defaultFileName, uri);
      const mimeType = candidateType || this.inferMimeType(uri, defaultMimeType);
      formData.append(
        fieldName,
        {
          uri,
          name,
          type: mimeType,
        } as any,
      );
      return;
    }

    throw new Error(`Formato de archivo no soportado para ${fieldName}`);
  }

  private ensureExtension(defaultName: string, uri: string): string {
    const existingName = defaultName || 'file';
    const extensionFromUri = this.extractExtension(uri);
    if (!extensionFromUri) {
      return existingName;
    }

    if (existingName.toLowerCase().endsWith(`.${extensionFromUri}`)) {
      return existingName;
    }

    return `${existingName.replace(/\.[^/.]+$/, '')}.${extensionFromUri}`;
  }

  private inferMimeType(uri: string, fallback: string): string {
    const extension = this.extractExtension(uri);
    if (!extension) {
      return fallback;
    }

    const map: Record<string, string> = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      webp: 'image/webp',
      pdf: 'application/pdf',
    };

    return map[extension.toLowerCase()] || fallback;
  }

  private extractExtension(uri: string): string | null {
    const match = uri.match(/\.([a-zA-Z0-9]+)(?:\?|$)/);
    return match ? match[1] : null;
  }

  //login de google
  async signInWithGoogle(): Promise<User | null> {
    if (Platform.OS === 'web') {
      return await this.signInWithGoogleWeb();
    }

    return await this.signInWithGoogleMobile();
  }

  // OAuth para la web 
  private async signInWithGoogleWeb(): Promise<User | null> {
    try {
      const redirectUrl = window.location.origin + window.location.pathname;
      console.log('OAuth Web - Redirect URL:', redirectUrl);
      
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${this.googleConfig.clientId}&` +
        `redirect_uri=${encodeURIComponent(redirectUrl)}&` +
        `scope=${encodeURIComponent(this.googleConfig.scopes.join(' '))}&` +
        `response_type=token&` +
        `prompt=select_account`;

        console.log('authUrl (web):', authUrl);
      
        console.log('URL de autenticacion web:', authUrl);
      
      //redirigir directamente en la misma ventana
      window.location.href = authUrl;
      
      return null;
    } catch (error) {
      console.error('Error en OAuth Web:', error);
      throw error;
    }
  }

  // OAuth para telefono (anda hasta ahi)
  private async signInWithGoogleMobile(): Promise<User | null> {
    try {
      const isExpoGo = Constants.appOwnership === 'expo' || Constants.appOwnership === 'guest';
      const redirectUrl = isExpoGo
        ? 'https://auth.expo.io/@benjatarta/rn2-auth'
        : AuthSession.makeRedirectUri({ scheme: 'rn2auth' });

      console.log('OAuth Movil - Redirect URL:', redirectUrl);
      console.log('Platform:', Platform.OS);
      console.log('App ownership:', Constants.appOwnership);

      const authRequest = new AuthRequest({
        clientId: this.googleConfig.clientId,
        redirectUri: redirectUrl,
        responseType: ResponseType.Token,
        scopes: this.googleConfig.scopes,
        usePKCE: false,
        prompt: Prompt.SelectAccount,
      });

      const discovery = {
        authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
      };

      await authRequest.makeAuthUrlAsync(discovery);

      const promptOptions: any = {
        useProxy: isExpoGo,
      };

      if (isExpoGo) {
        promptOptions.projectNameForProxy = '@benjatarta/rn2-auth';
      }

      const result = await authRequest.promptAsync(discovery, promptOptions);

  console.log('Resultado OAuth movil:', result);

      if (result.type === 'success') {
        const params = (result as any).params || {};

        if (params.error) {
    console.error('Google devolvio error dentro de success:', params);
          const description = params.error_description || params.error_subtype || params.error;
          throw new Error(`Google rechazó la solicitud: ${description}`);
        }

        if (params.access_token) {
          return await this.processAccessToken(params.access_token);
        }
        if ((result as any).url) {
          return await this.processOAuthSuccess((result as any).url);
        }
        throw new Error('La respuesta de Google no incluyó un token de acceso.');
      }

      if (result.type === 'error') {
  console.error('OAuth respondio error:', result);
        const description = (result as any).params?.error_description || (result as any).errorCode || 'Error desconocido de Google.';
        throw new Error(`Google no permitió iniciar sesión: ${description}`);
      }

      if (result.type === 'dismiss' || result.type === 'cancel') {
  console.log('Usuario cancelo OAuth');
        throw new Error('Se canceló el inicio de sesión con Google. Intenta nuevamente.');
      }

  console.error('OAuth fallo:', result);
      throw new Error('Error de autenticación con Google. Verifica tu conexión e inténtalo otra vez.');
    } catch (error) {
  console.error('Error en OAuth Movil:', error);
      throw error;
    }
  }

  //procesa datos OAuth directos
  private async processOAuthData(oauthData: {
    usuario: string;
    email: string;
    nombre: string;
    apellido: string;
    fotoPerfil: string;
    autenticacion: string;
  }): Promise<User> {
    try {
  console.log('Procesando datos OAuth...', oauthData);

      //intenta autenticar con el backend
      const user = await this.authenticateWithBackend({
        Usuario: oauthData.usuario,
        Email: oauthData.email,
        Nombre: oauthData.nombre,
        Apellido: oauthData.apellido,
        foto_perfil: oauthData.fotoPerfil,
        autenticacion: oauthData.autenticacion as 'google'
      });
      
      //guarda en AsyncStorage
      await AsyncStorage.setItem('userSession', JSON.stringify(user));
      this.user = user;
      
  console.log('Usuario autenticado y guardado:', user);
      return user;
    } catch (error) {
  console.error('Error procesando datos OAuth:', error);
      throw error;
    }
  }

  //procesa el resultado exitoso de OAuth
  private async processOAuthSuccess(url: string): Promise<User> {
  console.log('OAuth exitoso, procesando URL...', url);
    const urlObj = new URL(url);

    let params = new URLSearchParams(urlObj.hash ? urlObj.hash.substring(1) : '');
    let accessToken = params.get('access_token');

    if (!accessToken) {
      params = urlObj.search ? new URLSearchParams(urlObj.search.substring(1)) : new URLSearchParams();
      accessToken = params.get('access_token');
    }

    if (!accessToken) {
  console.error('No se recibio access token en la respuesta');
      throw new Error('No se pudo obtener el token de acceso de Google');
    }

    return this.processAccessToken(accessToken);
  }

  private async processAccessToken(accessToken: string): Promise<User> {
  console.log('Access token obtenido, obteniendo info de usuario...');
    const userInfoResponse = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`);

    if (!userInfoResponse.ok) {
      const errorText = await userInfoResponse.text();
  console.error('Error obteniendo user info:', userInfoResponse.status, errorText);
      throw new Error('No se pudo obtener la información del usuario de Google');
    }

    const userInfo = await userInfoResponse.json();
  console.log('User info:', userInfo);

    const user: User = {
      Usuario: userInfo.email?.split('@')[0] || userInfo.name,
      Email: userInfo.email,
      Nombre: userInfo.given_name || userInfo.name,
      Apellido: userInfo.family_name || '',
      foto_perfil: userInfo.picture,
      autenticacion: 'google',
    };

  console.log('Autenticando con backend...');
    const completeUser = await this.authenticateWithBackend(user);
    this.user = completeUser;
    await this.saveUserToStorage(completeUser);

    return completeUser;
  }

  //verifica si estamos regresando de OAuth 
  async checkOAuthReturn(): Promise<User | null> {
    if (Platform.OS !== 'web') return null;
    
    const hash = window.location.hash;
    if (hash && hash.includes('access_token')) {
  console.log('Detectado retorno de OAuth, procesando...');
      try {
        const user = await this.processOAuthSuccess(window.location.href);
        window.history.replaceState({}, document.title, window.location.pathname);
        return user;
      } catch (error) {
  console.error('Error procesando retorno OAuth:', error);
        window.history.replaceState({}, document.title, window.location.pathname);
        throw error;
      }
    }
    
    return null;
  }
  // Autenticación tradicional
  async signInWithCredentials(username: string, password: string): Promise<User | null> {
    try {
      console.log('Intentando login con:', { username, url: `${BASE_URL}/login` });
      const response = await axios.post<{ success: boolean; user?: any }>(`${BASE_URL}/login`, {
        Usuario: username,
        Password: password,
      });

      console.log('Respuesta del servidor:', response.data);

      if (response.data && response.data.success === true) {
        const userData = response.data.user;
        const user: User = {
          Id: userData.Id,
          Usuario: userData.Usuario,
          Email: userData.Email,
          Nombre: userData.Nombre,
          Apellido: userData.Apellido,
          foto_perfil: userData.foto_perfil,
          Telefono: userData.Telefono,
          Direccion: userData.Direccion,
          documentos: userData.documentos,
          autenticacion: userData.autenticacion || 'local',
        };
        
        this.user = user;
        await this.saveUserToStorage(user);
        console.log('Usuario logueado exitosamente:', user);
        return user;
      }

      console.log('Login falló - credenciales incorrectas');
      return null;
    } catch (error) {
      console.error('Error en autenticación tradicional:', error);
      throw error;
    }
  }

  //registro normal
  async signUpWithCredentials(username: string, password: string): Promise<User | null> {
    try {
      console.log('Intentando registro con:', { username, url: `${BASE_URL}/usuarios` });
      const registerResponse = await axios.post(`${BASE_URL}/usuarios`, {
        Usuario: username,
        Password: password,
      });

      console.log('Respuesta del registro:', registerResponse.data);

      //intenta login automatico después del registro
      return await this.signInWithCredentials(username, password);
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  }

  //autenticar con backend 
  private async authenticateWithBackend(user: User): Promise<User> {
    try {
  console.log('Enviando datos a backend:', {
        usuario: user.Usuario,
        email: user.Email,
        nombre: user.Nombre,
        apellido: user.Apellido,
        fotoPerfil: user.foto_perfil,
        autenticacion: user.autenticacion,
      });
      
      const response = await axios.post<{ success: boolean; user?: any; message?: string }>(`${BASE_URL}/oauth-login`, {
        usuario: user.Usuario,
        email: user.Email,
        nombre: user.Nombre,
        apellido: user.Apellido,
        fotoPerfil: user.foto_perfil,
        autenticacion: user.autenticacion,
      });
      
  console.log('Respuesta del backend:', response.data);
      
      //si el backend devuelve los datos del usuario
      if (response.data.user) {
        const backendUser: User = {
          Id: response.data.user.Id,
          Usuario: response.data.user.Usuario,
          Email: response.data.user.Email,
          Nombre: response.data.user.Nombre,
          Apellido: response.data.user.Apellido,
          foto_perfil: response.data.user.foto_perfil,
          Telefono: response.data.user.Telefono,
          Direccion: response.data.user.Direccion,
          documentos: response.data.user.documentos,
          autenticacion: response.data.user.autenticacion,
        };
  console.log('Datos completos del usuario obtenidos:', backendUser);
        return backendUser;
      }
      
      return user;
    } catch (error) {
  console.error('Error autenticando con backend:', error);
      return user;
    }
  }

  //actualizar perfil de usuario
  async updateProfile(profileData: Partial<User>): Promise<User | null> {
    try {
      if (!this.user) return null;

      const updatedUser = { ...this.user, ...profileData };
      
      //actualizar en backend
      await axios.put(`${BASE_URL}/usuario/${this.user.Usuario}`, {
        Nombre: updatedUser.Nombre,
        Apellido: updatedUser.Apellido,
        Email: updatedUser.Email,
        Telefono: updatedUser.Telefono,
        Direccion: updatedUser.Direccion,
        foto_perfil: updatedUser.foto_perfil,
        documentos: updatedUser.documentos,
      });
      
      this.user = updatedUser;
      await this.saveUserToStorage(updatedUser);
      
      return updatedUser;
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      throw error;
    }
  }

  //cerrar sesion
  async signOut(): Promise<void> {
    try {
      await AsyncStorage.removeItem('user');
      this.user = null;
    } catch (error) {
      console.error('Error cerrando sesión:', error);
    }
  }

  // obtener usuario actual
  getCurrentUser(): User | null {
    return this.user;
  }

  //verifica si hay una sesion guardada
  async loadUserFromStorage(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        this.user = JSON.parse(userData);
        return this.user;
      }
      return null;
    } catch (error) {
      console.error('Error cargando usuario desde storage:', error);
      return null;
    }
  }

  //guarda usuario en storage
  private async saveUserToStorage(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      console.error('Error guardando usuario en storage:', error);
    }
  }

  //verifica si el usuario esta autenticado
  isAuthenticated(): boolean {
    return this.user !== null;
  }
}

export default new AuthService();