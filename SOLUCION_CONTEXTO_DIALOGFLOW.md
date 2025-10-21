# 🔧 SOLUCIÓN: DialogFlow pierde el contexto

## 🔍 PROBLEMA IDENTIFICADO

Cuando el usuario dice "Olvidé mi contraseña" y luego proporciona el email, DialogFlow NO reconoce que el email es parte del mismo intent.

**Lo que pasa:**
```
Usuario: "Olvidé mi contraseña"
DialogFlow: ✅ Detecta intent "password_recovery"
DialogFlow: "¿Cuál es tu email?"

Usuario: "juan.perez@gmail.com"
DialogFlow: ❌ NO detecta intent (dice "Not available")
DialogFlow: No sabe qué hacer con el email
```

## ✅ SOLUCIÓN: Configurar OUTPUT CONTEXT

### **PASO 1: Agregar Output Context al Intent**

1. En DialogFlow, ve al intent **"Contraseña Olvidada"** o **"password_recovery"**
2. Expande la sección **"Contexts"** (arriba del intent)
3. En **"Output contexts"**, agrega:
   ```
   awaiting-email
   ```
   - Lifespan: `2` (dura 2 turnos de conversación)

4. Click **SAVE**

---

### **PASO 2: Crear Intent de Seguimiento (Follow-up)**

DialogFlow necesita un intent separado que capture SOLO el email cuando el contexto está activo.

#### **Opción A: Usar Follow-up Intent (Automático)**

1. En el intent **"Contraseña Olvidada"**
2. Click en **"Add follow-up intent"** (botón al lado del nombre del intent)
3. Selecciona **"custom"**
4. Nombra el nuevo intent: **"Contraseña Olvidada - proporcionar email"**

5. En este nuevo intent:
   - **Input context**: `awaiting-email` (se agrega automáticamente)
   - **Training phrases**: 
     ```
     juan.perez@gmail.com
     maria.lopez@gmail.com
     carlos@gmail.com
     mi correo es juan.perez@gmail.com
     es juan.perez@gmail.com
     ```
   - **Action and parameters**:
     - Parameter: `email`
     - Entity: `@sys.email`
     - Required: ✅ YES
     - NO agregar prompts (porque ya tenemos el email)

   - **Fulfillment**:
     - ✅ Enable webhook call for this intent

6. Click **SAVE**

---

#### **Opción B: Modificar el Intent Actual (Más Simple)**

Si no quieres crear un follow-up, modifica el intent actual:

1. Ve al intent **"Contraseña Olvidada"**

2. En **Training phrases**, agrega frases que incluyan SOLO el email:
   ```
   juan.perez@gmail.com
   maria.lopez@gmail.com
   es juan.perez@gmail.com
   mi correo es juan.perez@gmail.com
   ```

3. Asegúrate de marcar el email en las frases:
   - Selecciona `juan.perez@gmail.com` en la frase
   - Asígnale la entidad `@sys.email`
   - Nombre del parámetro: `email`

4. Esto hará que DialogFlow reconozca TANTO:
   - "Olvidé mi contraseña" → Pide email
   - "juan.perez@gmail.com" → Captura email y llama webhook

---

## 🔧 CONFIGURACIÓN RECOMENDADA (Más Robusta)

### **Intent Principal: "Contraseña Olvidada"**

```yaml
Training Phrases:
  - Olvidé mi contraseña
  - Resetear password
  - Recuperar contraseña
  - No puedo acceder
  
Contexts:
  Input contexts: (ninguno)
  Output contexts: 
    - awaiting-email (lifespan: 2)

Action and parameters:
  - email (@sys.email) - REQUIRED
    Prompts:
      - "Por favor, proporciona tu correo personal registrado"
      - "¿Cuál es tu email personal?"

Responses:
  (vacío - el webhook manejará la respuesta)

Fulfillment:
  ✅ Enable webhook call for this intent
```

### **Intent de Seguimiento: "Contraseña Olvidada - email"**

```yaml
Training Phrases:
  - $email:sys.email
  - mi correo es $email:sys.email
  - es $email:sys.email
  
Contexts:
  Input contexts: awaiting-email
  Output contexts: (ninguno)

Action and parameters:
  - email (@sys.email) - REQUIRED
    (sin prompts)

Fulfillment:
  ✅ Enable webhook call for this intent
```

---

## 🧪 PRUEBA

Después de configurar:

1. **En DialogFlow "Try it now":**
   ```
   Tú: "Olvidé mi contraseña"
   Bot: "¿Cuál es tu email personal?"
   
   Tú: "juan.perez@gmail.com"
   Bot: "Perfecto, Juan Pérez García..."
   ```

2. **Verifica en DIAGNOSTIC INFO:**
   - Primera respuesta: INTENT = "password_recovery" o "Contraseña Olvidada"
   - Segunda respuesta: INTENT = "Contraseña Olvidada - email" o mismo intent
   - ACTION debe tener valor

---

## 🔧 PROBLEMA DEL FRONTEND

Si el frontend muestra "problemas técnicos", verifica:

### **1. Ver logs del NLP Service**

```bash
tail -f /home/desci/Documentos/constru/upt-chat-system/services/nlp-service/nlp-service.log
```

Busca errores cuando hagas la prueba en el frontend.

### **2. Ver requests en ngrok**

Abre en tu navegador:
```
http://localhost:4040
```

Cuando pruebes en el frontend, deberías ver las requests llegando.

### **3. Verificar que el frontend esté llamando al webhook**

El frontend debe estar enviando mensajes a DialogFlow, y DialogFlow debe estar llamando al webhook.

---

## 📝 RESUMEN DE CAMBIOS NECESARIOS

1. ✅ **Agregar Output Context** en "Contraseña Olvidada"
2. ✅ **Agregar frases de entrenamiento** con solo emails
3. ✅ **Marcar emails** en las frases como entidad `@sys.email`
4. ✅ **Verificar webhook** esté habilitado en el intent

---

**¿Quieres que te ayude a revisar la configuración específica de tu intent en DialogFlow?**
