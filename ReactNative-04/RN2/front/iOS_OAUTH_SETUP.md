# 🚨 OAuth iOS Error - Solución

## Problema Actual en iOS
Error: `com.apple.AuthenticationServices.WebAuthenticationSession error 1`

## ✅ Solución Completa

### 1. Ve a Google Cloud Console
- URL: https://console.cloud.google.com/
- Inicia sesión con: `benjatarta03@gmail.com`

### 2. Edita las Credenciales OAuth
- Ve a: **APIs y servicios** → **Credenciales**  
- Encuentra tu Client ID: `582233369139-c0bjg5il7og2ocng7lu9f00d55cv3phc`
- Haz clic en **editar** (ícono lápiz)

### 3. Agrega URLs de Redirección para TODAS las plataformas

En "**URIs de redirección autorizados**", agrega TODAS estas URLs:

#### Para Web:
```
http://localhost:8083
http://localhost:8082
http://localhost:8081
```

#### Para iOS (Expo Go):
```
exp://localhost:8081
exp://localhost:8082
exp://localhost:8083
rn2auth://redirect
https://auth.expo.io/@anonymous/rn2-auth
https://auth.expo.io/@benjatarta/rn2-auth
```

#### Para Android:
```
com.benjatarta.rn2auth://redirect
```

### 4. Guarda y Espera
- Clic en **"Guardar"**
- **Espera 5 minutos** para que se propaguen los cambios

### 5. En tu iPhone:
1. **Asegúrate de estar logueado en Expo Go**
2. **Conecta a la misma WiFi** que tu PC
3. **Escanea el QR** nuevamente
4. **Prueba OAuth**

## 🔧 Soluciones Alternativas para iOS:

### Opción A: Usar Web en lugar de móvil
- Abre http://localhost:8083 en Safari de tu iPhone
- El OAuth funcionará como en web

### Opción B: Crear cuenta de Expo
1. Ve a https://expo.dev/signup
2. Crea cuenta con tu email
3. Logúeate en Expo CLI: `npx expo login`
4. Esto permitirá URLs de redirección más estables

---

## ⚠️ URLs Críticas para iOS:
Las más importantes para agregar:
```
exp://localhost:8081
rn2auth://redirect
https://auth.expo.io/@anonymous/rn2-auth
```

Una vez configurado correctamente, el OAuth debería funcionar en iOS sin errores.