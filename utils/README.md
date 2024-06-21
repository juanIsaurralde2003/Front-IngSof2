# DON'T BE REAL

## Instrucciones de Instalación

1. **Descargar Expo Go**:
   - Descarga Expo Go en tu dispositivo móvil desde Google Play Store o Apple App Store.

2. **Instalar dependencias**:
   - Abre una terminal en la carpeta del proyecto.
   - Ejecuta el siguiente comando para instalar todas las dependencias necesarias:
     ```sh
     npm install
     ```

3. **Iniciar el proyecto**:
   - En la misma terminal, ejecuta el siguiente comando para iniciar el proyecto:
     ```sh
     npx expo start
     ```

4. **Ejecutar en dispositivo móvil**:
   - Desplázate hasta encontrar el código QR correspondiente al Metro Bundler.
   - Escanea el código QR con la cámara de tu dispositivo móvil que redirigirá a la aplicación Expo Go.
   - Esto automáticamente abrirá el proyecto.

5. **Pasos para Logearte con tu Cuenta de Expo o EAS**

   5.1. **Crear o Iniciar Sesión en una Cuenta de Expo:**

      Si aún no tienes una cuenta de Expo, ve a Expo Sign Up y crea una cuenta.
      Si ya tienes una cuenta, ve a Expo Login e inicia sesión con tus credenciales.
   
   5.2. **Iniciar Sesión desde la Terminal:**

      En la terminal, ejecuta el siguiente comando para iniciar sesión en tu cuenta de Expo:
      ```sh
     npx expo login
     ```
      Ingresa tu nombre de usuario y contraseña cuando se te solicite.

   5.3. **Unirte a la Organización:**

      El equipo pedirá tu nombre de usuario de expo para enviarte invitación a la organización.
      Una vez que hayas recibido la invitación, acéptala desde tu cuenta en Expo.
   
   5.4. **Configurar EAS (Expo Application Services):**
      
      Asegúrate de que tu proyecto esté configurado para usar EAS si necesitas funcionalidades avanzadas como notificaciones push.
      En la terminal, ejecuta:
      ```sh
     npx eas login
     ```
      Ingresa tus credenciales de Expo.