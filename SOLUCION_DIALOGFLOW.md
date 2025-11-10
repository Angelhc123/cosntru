# 🚀 GUÍA RÁPIDA: Configurar Intents en DialogFlow

## ✅ PROBLEMA IDENTIFICADO:
DialogFlow funciona perfectamente, pero **no tiene intents entrenados**.
Por eso devuelve "Default Fallback Intent" con confianza 0.000.

## 📋 PASOS PARA SOLUCIONARLO:

### 1. Acceder a DialogFlow Console
1. Ve a https://dialogflow.cloud.google.com/
2. Selecciona el proyecto: **upt-chat-fhps**
3. Ve a "Intents" en el menú lateral

### 2. Crear Intent: "Saludos"
1. Haz clic en "CREATE INTENT"
2. Nombre: `Saludos`
3. **Training phrases** (añade estas frases):
   - hola
   - buenos días
   - buenas tardes
   - hi
   - hello
   - saludos
   - qué tal

4. **Responses** (añade esta respuesta):
   ```
   ¡Hola! Soy el Asistente Virtual de la UPT. ¿En qué puedo ayudarte?
   ```

5. Haz clic en "SAVE"

### 3. Crear Intent: "Contraseña Olvidada"
1. CREATE INTENT → Nombre: `Contraseña Olvidada`
2. **Training phrases**:
   - olvidé mi contraseña
   - no recuerdo mi clave
   - perdí mi password
   - recuperar contraseña
   - resetear clave
   - cambiar contraseña

3. **Parameters** (importante para recoger email):
   - Parameter name: `email`
   - Entity type: `@sys.email`
   - Prompt: "Por favor, proporciona tu correo electrónico"

4. **Responses**:
   ```
   Te ayudo con la recuperación de tu contraseña. He iniciado el proceso para el correo: $email
   ```

5. **Webhook**: Habilitar "Enable webhook call for this intent"
6. SAVE

### 4. Crear Intent: "Contraseña Institucional"
1. CREATE INTENT → Nombre: `Contraseña Institucional`
2. **Training phrases**:
   - contraseña institucional
   - clave del sistema
   - password de la universidad
   - acceso institucional
   - login universidad

3. **Parameters**:
   - Parameter name: `student_name`
   - Entity type: `@sys.person`
   - Prompt: "¿Cuál es tu nombre completo?"

4. **Responses**:
   ```
   Para problemas con la contraseña institucional, necesito escalarlo al soporte. Tu solicitud ha sido registrada para: $student_name
   ```

5. **Webhook**: Habilitar
6. SAVE

### 5. Probar los Intents
1. En la consola de DialogFlow, usa el simulador (lado derecho)
2. Escribe: "hola"
3. Debería devolver el saludo configurado
4. Escribe: "olvidé mi contraseña"
5. Debería pedir tu email

## 🎯 RESULTADO ESPERADO:
Una vez creados los intents, los logs cambiarán de:
```
Intent: Default Fallback Intent
Confidence: 0.000
```

A:
```
Intent: Saludos
Confidence: 0.95
```

## 📝 NOTA IMPORTANTE:
- Después de crear cada intent, DialogFlow **auto-entrena** el modelo
- Los cambios se aplican inmediatamente
- El webhook debe estar configurado para los intents que necesitan escalamiento

¿Necesitas ayuda con algún paso específico?