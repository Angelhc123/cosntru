# 🔐 CONFIGURACIÓN CORRECTA DEL INTENT password_recovery EN DIALOGFLOW

## ❌ PROBLEMA IDENTIFICADO

El sistema NO debe detectar cualquier email como intención de recuperar contraseña.

**Flujo INCORRECTO (lo que NO queremos):**
```
Usuario: "Mi email es juan.perez@gmail.com"
Sistema: ❌ ¿Quieres recuperar tu contraseña? (MAL!)
```

**Flujo CORRECTO (lo que SÍ queremos):**
```
Usuario: "Olvidé mi contraseña"
Sistema: ✅ ¿Cuál es tu email personal?
Usuario: "juan.perez@gmail.com"
Sistema: ✅ Verificando... (BIEN!)
```

---

## ✅ CONFIGURACIÓN DEL INTENT EN DIALOGFLOW

### **1. Nombre del Intent**
```
password_recovery
```
O el nombre que ya tienes (vi "Contraseña Olvidada" en tu imagen)

---

### **2. Training Phrases (Frases de Entrenamiento)**

Agregar estas frases SIN incluir emails:

```
Olvidé mi contraseña
Resetear password
Restablecer contraseña
Recuperar contraseña
No puedo acceder
Cambiar contraseña
Olvidé mi clave
Reset password
No recuerdo mi contraseña
Perdí mi contraseña
Resetear mi password
Quiero recuperar mi contraseña
Ayuda con mi contraseña
```

**❗ IMPORTANTE**: No agregues emails en las training phrases. Solo la intención.

---

### **3. Action and Parameters**

Configurar 1 parámetro REQUERIDO:

| Parameter Name | Entity | Value | Required | Prompts |
|----------------|--------|-------|----------|---------|
| `email` | `@sys.email` | `$email` | ✅ YES | Ver abajo |

**Prompts para el parámetro `email`:**
```
Por favor, proporciona tu correo personal registrado en el sistema
¿Cuál es tu email personal?
Dime tu correo electrónico personal
Indícame tu email personal para verificar tu identidad
```

---

### **4. Responses (Respuestas)**

**Respuesta mientras se procesa:**
```json
{
  "text": [
    "Verificando tu email personal en el sistema...",
    "Un momento, estoy buscando tu cuenta..."
  ]
}
```

**❗ IMPORTANTE**: La respuesta final vendrá del webhook (NLP Service), no de DialogFlow.

---

### **5. Fulfillment (Webhook)**

✅ **Enable webhook call for this intent**

Esto es CRÍTICO. El webhook debe estar activado para que DialogFlow envíe los datos al NLP Service.

---

## 📡 PAYLOAD QUE DIALOGFLOW ENVIARÁ AL WEBHOOK

Cuando el usuario complete el flujo, DialogFlow enviará este JSON al NLP Service:

```json
{
  "responseId": "1234-5678-abcd",
  "queryResult": {
    "queryText": "juan.perez@gmail.com",
    "intent": {
      "name": "projects/upt-chat-fhps/agent/intents/52910ec4-9c9e-44ab-b285-e052395e434",
      "displayName": "Contraseña Olvidada"
    },
    "parameters": {
      "email": "juan.perez@gmail.com"  // ← AQUÍ ESTÁ EL EMAIL
    },
    "allRequiredParamsPresent": true,
    "fulfillmentText": "",
    "fulfillmentMessages": [],
    "intentDetectionConfidence": 0.95,
    "languageCode": "es"
  },
  "session": "projects/upt-chat-fhps/agent/sessions/12345"
}
```

---

## 🐍 CÓDIGO NLP SERVICE (Python)

El NLP Service debe procesar así:

```python
# services/nlp-service/app/routes/chat.py

@router.post("/chat")
async def chat_endpoint(request: ChatRequest):
    try:
        # 1. Enviar mensaje a DialogFlow
        dialogflow_response = detect_intent_with_dialogflow(
            project_id=DIALOGFLOW_PROJECT_ID,
            session_id=request.session_id,
            text=request.message,
            language_code="es"
        )
        
        intent_name = dialogflow_response.query_result.intent.display_name
        parameters = dialogflow_response.query_result.parameters
        
        # 2. SI el intent es password_recovery Y tiene el parámetro email
        if intent_name == "Contraseña Olvidada":
            
            # Verificar que el parámetro email existe
            if not parameters.get("email"):
                return {
                    "response": "Por favor proporciona tu email personal",
                    "intent": intent_name,
                    "confidence": dialogflow_response.query_result.intent_detection_confidence
                }
            
            email_personal = parameters["email"]
            
            # 3. Llamar al API Gateway para verificar
            api_gateway_url = f"{API_GATEWAY_BASE_URL}/api/v1/password-reset/verify-email"
            
            verify_response = requests.post(
                api_gateway_url,
                json={"emailPersonal": email_personal},
                timeout=10
            )
            
            result = verify_response.json()
            
            # 4. Responder según el resultado
            if result.get("exists"):
                # Email encontrado, iniciar recuperación
                initiate_response = requests.post(
                    f"{API_GATEWAY_BASE_URL}/api/v1/password-reset/initiate",
                    json={
                        "emailPersonal": email_personal,
                        "sessionId": request.session_id
                    },
                    timeout=15
                )
                
                if initiate_response.json().get("success"):
                    return {
                        "response": f"Perfecto, {result['nombreCompleto']}. He enviado un correo a {email_personal} con las instrucciones para recuperar tu contraseña. Por favor revisa tu bandeja de entrada.",
                        "intent": intent_name,
                        "email_sent": True
                    }
                else:
                    return {
                        "response": "Hubo un error al procesar tu solicitud. Por favor intenta más tarde o contacta con soporte.",
                        "intent": intent_name,
                        "error": True
                    }
            else:
                # Email NO encontrado
                return {
                    "response": f"Lo siento, el email {email_personal} no está registrado en el sistema. Por favor verifica que sea tu correo personal o contacta con soporte.",
                    "intent": intent_name,
                    "email_found": False
                }
        
        # 5. Otros intents (flujo normal)
        return {
            "response": dialogflow_response.query_result.fulfillment_text,
            "intent": intent_name,
            "confidence": dialogflow_response.query_result.intent_detection_confidence
        }
        
    except Exception as e:
        logger.error(f"Error en chat endpoint: {str(e)}")
        return {
            "response": "Disculpa, ocurrió un error. Por favor intenta nuevamente.",
            "error": str(e)
        }
```

---

## 🔍 VERIFICACIÓN DEL FLUJO

### **Test 1: Activar Intent**
```
Usuario: "Olvidé mi contraseña"

DialogFlow Detecta:
- Intent: "Contraseña Olvidada"
- Confidence: 0.95
- Parameters: {} (vacío, falta el email)

DialogFlow Responde:
"Por favor, proporciona tu correo personal registrado en el sistema"
```

### **Test 2: Proporcionar Email (Correcto)**
```
Usuario: "juan.perez@gmail.com"

DialogFlow Captura:
- Intent: "Contraseña Olvidada" (mismo contexto)
- Parameters: { email: "juan.perez@gmail.com" }
- allRequiredParamsPresent: true

DialogFlow → Webhook (NLP Service):
{
  "intent": "Contraseña Olvidada",
  "parameters": { "email": "juan.perez@gmail.com" }
}

NLP Service → API Gateway:
POST /api/v1/password-reset/verify-email
{ "emailPersonal": "juan.perez@gmail.com" }

API Gateway → ProyectoTest PHP:
POST /public/api_verify_email.php
{ "email_personal": "juan.perez@gmail.com" }

Response: { exists: true, usuario: "2020068376", ... }

NLP Service → Usuario:
"Perfecto, Juan Pérez García. He enviado un correo a juan.perez@gmail.com..."
```

### **Test 3: Email Incorrecto**
```
Usuario: "Olvidé mi contraseña"
DialogFlow: "¿Cuál es tu email personal?"
Usuario: "noexiste@gmail.com"

API Gateway verifica → No existe en BD

NLP Service → Usuario:
"Lo siento, el email noexiste@gmail.com no está registrado en el sistema."
```

### **Test 4: Usuario menciona email SIN intent (NO debe activar)**
```
Usuario: "Mi email es juan.perez@gmail.com"

DialogFlow Detecta:
- Intent: "Default Fallback" o algún otro
- NO debe detectar "Contraseña Olvidada"

DialogFlow Responde:
"¿En qué puedo ayudarte?" (respuesta normal)
```

---

## 🎯 RESUMEN DE CAMBIOS NECESARIOS

### **1. En DialogFlow Console**
- [ ] Ir al intent "Contraseña Olvidada"
- [ ] Verificar que las training phrases NO tengan emails
- [ ] Agregar parámetro `email` (tipo @sys.email)
- [ ] Marcar `email` como **REQUIRED**
- [ ] Agregar prompts para solicitar el email
- [ ] Activar **Enable webhook call for this intent**
- [ ] Guardar cambios

### **2. En NLP Service (Python)**
- [ ] Actualizar `app/routes/chat.py` con la lógica del código de arriba
- [ ] Verificar que solo procese cuando `intent == "Contraseña Olvidada"` AND `parameters["email"]` existe
- [ ] Llamar al API Gateway solo en ese caso

### **3. En API Gateway (Ya está listo)**
- [x] Endpoint `/api/v1/password-reset/verify-email` ✅
- [x] Endpoint `/api/v1/password-reset/initiate` ✅

### **4. En ProyectoTest PHP (Ya está listo)**
- [x] `api_verify_email.php` ✅
- [x] `api_update_password.php` ✅

---

## 📸 CONFIGURACIÓN VISUAL EN DIALOGFLOW

### **Sección: Action and Parameters**
```
┌─────────────────────────────────────────────────────────┐
│ Action and parameters                                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ REQUIRED ✅ | PARAMETER NAME | ENTITY     | VALUE      │
│ ─────────────────────────────────────────────────────  │
│    ✅       |     email      | @sys.email | $email     │
│                                                         │
│ Prompts for "email":                                    │
│ ─────────────────────────────────────────────────────  │
│ • Por favor, proporciona tu correo personal            │
│ • ¿Cuál es tu email personal?                          │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### **Sección: Fulfillment**
```
┌─────────────────────────────────────────────────────────┐
│ Fulfillment                                             │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ ✅ Enable webhook call for this intent                  │
│                                                         │
│ ❌ Enable webhook call for slot filling                 │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🧪 COMANDOS DE PRUEBA

### **Probar DialogFlow directamente:**
```bash
# En la consola de DialogFlow, probar estas conversaciones:

Test 1:
Usuario: "Olvidé mi contraseña"
Esperado: "Por favor, proporciona tu correo personal..."

Test 2:
Usuario: "juan.perez@gmail.com"
Esperado: Debe llamar al webhook con el parámetro

Test 3 (NO debe activar intent):
Usuario: "Mi correo es juan.perez@gmail.com"
Esperado: NO debe detectar intent de password recovery
```

---

## 📝 CHECKLIST DE IMPLEMENTACIÓN

- [ ] Configurar parámetro `email` en DialogFlow como REQUIRED
- [ ] Agregar prompts para solicitar email
- [ ] Activar webhook en el intent
- [ ] Actualizar NLP Service para procesar solo cuando tenga intent + email
- [ ] Probar flujo completo en DialogFlow console
- [ ] Probar con NLP Service integrado
- [ ] Verificar que NO se active con emails sueltos

---

**¿Necesitas que te ayude a actualizar el código del NLP Service también?**
