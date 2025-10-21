# 🎯 CONFIGURACIÓN CORRECTA DE DIALOGFLOW PARA RF004
## (Recuperación de Contraseña con Flujo Conversacional)

---

## 🚨 PROBLEMA ACTUAL

DialogFlow está tratando cada mensaje como un intent separado:
- Usuario: "Olvidé mi contraseña" → ✅ Detecta `password_recovery`
- Usuario: "juan.perez@gmail.com" → ❌ Detecta `Default Fallback Intent` (pierde contexto)

---

## ✅ SOLUCIÓN: Configurar Parámetros Requeridos (REQUIRED)

### **PASO 1: Configurar el Intent Principal**

1. Ve a **DialogFlow Console**: https://dialogflow.cloud.google.com/
2. Selecciona tu agente
3. Ve al intent **"password_recovery"** o **"Contraseña Olvidada"**

### **PASO 2: Configurar el Parámetro Email como REQUIRED**

#### **A. Sección "Action and parameters"**

Asegúrate de tener:

```
PARAMETER NAME    ENTITY           VALUE               REQUIRED    PROMPTS
email             @sys.email       $email              ✅ YES      (ver abajo)
```

**IMPORTANTE:** Marca el checkbox **"REQUIRED"** ✅

#### **B. Agregar Prompts (Preguntas del bot cuando falta el email)**

Cuando marcas "REQUIRED", aparece una columna para agregar prompts. Agrega estas frases:

```
Por favor, proporciona tu correo electrónico personal (@upt.pe)
¿Cuál es tu correo electrónico institucional?
Necesito tu email para verificar tu identidad. ¿Cuál es?
```

### **PASO 3: Training Phrases (Entrenamiento)**

Asegúrate de tener frases que:
1. **SIN email** (para que pida el email):
   ```
   Olvidé mi contraseña
   Resetear password
   Recuperar contraseña
   No puedo acceder a mi cuenta
   Perdí mi clave
   ```

2. **CON email** (para cuando el usuario lo da de una vez):
   ```
   Olvidé mi contraseña, mi email es juan.perez@upt.pe
   Resetear password de juan.perez@upt.pe
   Recuperar contraseña para juan.perez@upt.pe
   ```

**IMPORTANTE:** En las frases con email, selecciona el email y márcalo como `@sys.email`

### **PASO 4: Responses (Respuestas)**

**¡DEJA ESTA SECCIÓN VACÍA!** ⚠️

No agregues respuestas de texto aquí porque el webhook manejará las respuestas.

### **PASO 5: Fulfillment (Webhook)**

**✅ ACTIVA EL WEBHOOK:**

```
☑️ Enable webhook call for this intent
```

Asegúrate de que esté marcado.

---

## 🔄 CÓMO FUNCIONA EL FLUJO

### **Escenario 1: Usuario NO proporciona email de entrada**

```
Usuario: "Olvidé mi contraseña"
           ↓
DialogFlow detecta: password_recovery
           ↓
DialogFlow ve: email es REQUIRED pero no lo tengo
           ↓
DialogFlow pregunta: "Por favor, proporciona tu correo electrónico personal"
           ↓
Usuario: "juan.perez@upt.pe"
           ↓
DialogFlow captura: email = "juan.perez@upt.pe"
           ↓
DialogFlow llama al webhook con el email
           ↓
Webhook procesa y envía nueva contraseña
```

### **Escenario 2: Usuario proporciona email desde el inicio**

```
Usuario: "Olvidé mi contraseña, mi email es juan.perez@upt.pe"
           ↓
DialogFlow detecta: password_recovery
DialogFlow captura: email = "juan.perez@upt.pe"
           ↓
DialogFlow tiene todos los parámetros REQUIRED
           ↓
DialogFlow llama al webhook directamente
           ↓
Webhook procesa y envía nueva contraseña
```

---

## ⚙️ CONFIGURACIÓN AVANZADA (Opcional)

### **Usar Contexts para Mayor Control**

Si quieres más control sobre el flujo, puedes usar contexts:

#### **En el Intent "password_recovery":**

**Output contexts:**
```
Context name: awaiting-email
Lifespan: 2
```

Esto mantiene el contexto activo por 2 turnos de conversación.

#### **Crear un Follow-up Intent:**

1. En el intent "password_recovery", click **"Add follow-up intent"**
2. Selecciona **"custom"**
3. Nombra: **"password_recovery - provide-email"**

**Configuración del follow-up:**

```yaml
Input contexts: awaiting-email (se agrega automáticamente)

Training phrases:
  - $email:sys.email
  - mi correo es $email:sys.email  
  - es $email:sys.email
  - $email:sys.email por favor

Action and parameters:
  - email (@sys.email) - REQUIRED: NO (ya lo tenemos en la frase)

Fulfillment:
  ✅ Enable webhook call for this intent
```

---

## 🧪 PRUEBA EN DIALOGFLOW CONSOLE

### **Test 1: Sin email inicial**

```
Tú: "Olvidé mi contraseña"
Bot: "Por favor, proporciona tu correo electrónico personal"

Tú: "juan.perez@upt.pe"
Bot: (respuesta del webhook con los datos del usuario)
```

En **DIAGNOSTIC INFO** deberías ver:
- Intent: `password_recovery`
- Parameters: `email: "juan.perez@upt.pe"`
- Action: (lo que configuraste)

### **Test 2: Con email inicial**

```
Tú: "Olvidé mi contraseña, mi email es juan.perez@upt.pe"
Bot: (respuesta del webhook directamente)
```

---

## 🐛 DEBUGGING

### **Si el segundo mensaje no funciona:**

1. **Verifica en DialogFlow "Try it now":**
   - Escribe el mensaje
   - Mira el panel derecho "DIAGNOSTIC INFO"
   - Verifica que INTENT no sea "Default Fallback Intent"
   - Verifica que PARAMETERS tenga el email

2. **Ver requests en ngrok:**
   ```bash
   # Abre en navegador:
   http://localhost:4040
   ```
   Deberías ver las requests llegando al webhook.

3. **Ver logs del NLP Service:**
   ```bash
   tail -f /home/desci/Documentos/constru/upt-chat-system/services/nlp-service/nlp-service.log
   ```
   Busca errores después de enviar el segundo mensaje.

---

## 📱 PRUEBA EN EL FRONTEND

Una vez que funcione en DialogFlow Console, prueba en:

```
http://localhost:8000/test_password_recovery.html
```

Esta página es **independiente del sistema de la universidad** y te permite:
- ✅ Probar el flujo completo
- ✅ Ver logs en tiempo real
- ✅ Ver requests y responses
- ✅ Botones rápidos para probar
- ✅ No interfiere con el sistema real

---

## 🎯 CHECKLIST FINAL

- [ ] Intent "password_recovery" tiene parámetro email como **REQUIRED** ✅
- [ ] Prompts configurados para pedir el email
- [ ] Training phrases incluyen casos con y sin email
- [ ] Emails marcados como entidad `@sys.email`
- [ ] Sección "Responses" está VACÍA
- [ ] Webhook está **ACTIVADO** en Fulfillment
- [ ] URL del webhook configurada: `https://pentangular-laree-floggingly.ngrok-free.dev/webhook`
- [ ] Prueba en DialogFlow Console funciona
- [ ] Prueba en `test_password_recovery.html` funciona

---

## 💡 NOTAS IMPORTANTES

1. **No agregues el email a las Training Phrases simples** - Solo márcalo cuando ya está en una frase
2. **DialogFlow es INTELIGENTE** - Si marcas el parámetro como REQUIRED, él mismo mantendrá el contexto
3. **Los contexts son OPCIONALES** - Solo úsalos si necesitas más control
4. **El webhook se llama SOLO cuando tiene todos los parámetros REQUIRED**
5. **Usa la página de prueba** para no interferir con el sistema real

---

**¿Listo para configurar?** 🚀

Sigue estos pasos en orden y prueba después de cada cambio en DialogFlow Console.
