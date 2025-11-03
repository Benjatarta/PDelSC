# 🚨 ERROR: redirect_uri_mismatch - Solución

## Problema Actual
Estás viendo este error al intentar login con Google:
```
Error 400: redirect_uri_mismatch
Cross-Origin-Opener-Policy policy would block the window.closed call
```

## ✅ Solución Paso a Paso

### 1. Ve a Google Cloud Console
- URL: https://console.cloud.google.com/
- Inicia sesión con: `benjatarta03@gmail.com`

### 2. Encuentra tu Proyecto
- Busca el proyecto "RN2" o el que contiene tu Client ID
- Client ID actual: `582233369139-c0bjg5il7og2ocng7lu9f00d55cv3phc`

### 3. Edita las Credenciales OAuth
- Ve a: **APIs y servicios** → **Credenciales**  
- Encuentra tu Client ID y haz clic en **editar** (ícono lápiz)

### 4. Agrega URLs de Redirección
En "**URIs de redirección autorizados**", agrega EXACTAMENTE esta URL:

```
http://localhost:8083
```

### 5. Guarda y Espera
- Clic en **"Guardar"**
- **Espera 2-3 minutos** para que se propaguen los cambios

### 6. Prueba de Nuevo
- Recarga tu aplicación
- Intenta login con Google nuevamente

## � ¿Cómo Funciona Ahora?

El OAuth se ha mejorado para web:
- ✅ **Para Web**: Redirige en la misma ventana (evita Cross-Origin-Opener-Policy)
- ✅ **Para Móvil**: Usa popup tradicional
- ✅ **Auto-detección**: Al regresar de Google, detecta automáticamente y completa el login

## 🎯 URL Requerida en Google Cloud Console:

**SOLO necesitas agregar esta URL:**
```
http://localhost:8083
```

## ⚡ Flujo de OAuth Web:

1. Presionas "Continuar con Google"
2. Te redirige a Google en la misma ventana
3. Haces login en Google
4. Google te redirige de vuelta a tu app
5. La app detecta automáticamente y completa el login

---

## ⚠️ Importante:
- La URL debe ser **EXACTAMENTE**: `http://localhost:8083`
- Sin barra final (/)
- Con http:// (no https://)
- Con el puerto correcto (:8083)

Una vez configurado, el OAuth debería funcionar perfectamente sin errores de Cross-Origin-Opener-Policy.

2. **Configurar para móvil:**
   - Android: Agrega tu Package Name y Class Name
   - iOS: Agrega tu Bundle ID

3. **Actualizar authService.ts:**
   ```typescript
   private facebookConfig = {
     clientId: 'TU_FACEBOOK_APP_ID',
     scopes: ['public_profile', 'email'],
   };
   ```

## Apple OAuth Setup (Solo iOS)

1. **Configurar en Apple Developer:**
   - Ve a [Apple Developer](https://developer.apple.com/)
   - Crea un Service ID para "Sign in with Apple"
   - Configura tu Bundle ID

2. **Actualizar app.json:**
   ```json
   {
     "expo": {
       "ios": {
         "usesAppleSignIn": true
       }
     }
   }
   ```

## Configuración de app.json

Agregar al archivo `app.json` en la raíz del proyecto:

```json
{
  "expo": {
    "name": "Tu App",
    "slug": "tu-app",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "usesAppleSignIn": true
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#FFFFFF"
      }
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      [
        "expo-image-picker",
        {
          "photosPermission": "La aplicación accede a tus fotos para actualizar tu foto de perfil.",
          "cameraPermission": "La aplicación accede a tu cámara para tomar fotos de perfil y documentos."
        }
      ],
      [
        "expo-location",
        {
          "locationAlwaysAndWhenInUsePermission": "La aplicación necesita acceso a tu ubicación para completar tu perfil."
        }
      ],
      [
        "expo-document-picker",
        {
          "iCloudContainerEnvironment": "Production"
        }
      ]
    ]
  }
}
```

## Permisos requeridos

La app solicitará automáticamente los siguientes permisos:

- **Cámara**: Para tomar fotos de perfil y escanear documentos
- **Galería**: Para seleccionar fotos existentes
- **Ubicación**: Para autocompletar la dirección
- **Almacenamiento**: Para guardar fotos y documentos

## Base de datos actualizada

El backend ahora usa una tabla `usuario_perfil` con los siguientes campos:

- `id`: ID único
- `usuario`: Nombre de usuario
- `password`: Contraseña (solo para usuarios locales)
- `email`: Email del usuario
- `name`: Nombre completo
- `phone`: Teléfono
- `address`: Dirección
- `profile_image`: URL/ruta de la foto de perfil
- `document_image`: URL/ruta del documento escaneado
- `auth_provider`: Proveedor de autenticación (local, google, facebook, apple)
- `provider_id`: ID del proveedor OAuth
- `latitude`: Latitud de la ubicación
- `longitude`: Longitud de la ubicación
- `created_at`: Fecha de creación
- `updated_at`: Fecha de última actualización

## Endpoints de la API

- `POST /usuarios` - Registro tradicional
- `POST /login` - Login tradicional
- `POST /oauth-login` - Login/registro OAuth
- `PUT /usuario/:usuario` - Actualizar perfil
- `GET /usuario/:usuario` - Obtener perfil
- `GET /usuarios` - Obtener todos los usuarios

## Próximos pasos

1. Configurar las credenciales OAuth en los respectivos proveedores
2. Actualizar las configuraciones en `authService.ts`
3. Probar la autenticación con cada proveedor
4. Implementar manejo de errores más robusto
5. Agregar validación de datos en el backend
6. Implementar refresh tokens para sesiones más largas