# 🔧 SOLUCIÓN AL ERROR DEL CHATBOX

## 🔴 PROBLEMA IDENTIFICADO

El chatbot responde con "Lo siento, no entendí tu pregunta" porque:

1. ✅ **Servicios corriendo**: Todos los servicios están activos
2. ✅ **Credenciales configuradas**: DialogFlow credentials están bien
3. ❌ **DialogFlow SIN INTENTS**: El agente de DialogFlow está vacío (imagen muestra "No regular intents yet")
4. ⚠️ **Fallback local insuficiente**: El sistema NLP local no tiene suficientes intents/FAQs

---

## ✅ SOLUCIONES (3 OPCIONES)

### **OPCIÓN 1: Configurar Intents en DialogFlow (RECOMENDADO)**

#### Paso 1: Ir a DialogFlow Console
```
https://dialogflow.cloud.google.com/#/agent/upt-chat-fhps/intents
```

#### Paso 2: Crear Intents Básicos

**Intent 1: Saludos**
- Training phrases:
  - "Hola"
  - "Buenos días"
  - "Buenas tardes"
  - "Hola, ¿cómo estás?"
  - "Hey"
  
- Response:
  - "¡Hola! Soy el asistente virtual de la UPT. ¿En qué puedo ayudarte hoy?"

**Intent 2: Horarios de Atención**
- Training phrases:
  - "¿Cuál es el horario de atención?"
  - "¿A qué hora atienden?"
  - "Horarios de la universidad"
  - "¿Cuándo están abiertos?"
  
- Response:
  - "El horario de atención de la UPT es de 8:00 AM a 5:00 PM, de lunes a viernes."

**Intent 3: Información de Matrícula**
- Training phrases:
  - "¿Cómo me matriculo?"
  - "Información sobre matrícula"
  - "Proceso de matrícula"
  - "¿Cuándo es la matrícula?"
  
- Response:
  - "El proceso de matrícula se realiza online a través de la intranet. Las fechas son del 1 al 15 de cada semestre. ¿Necesitas más detalles?"

**Intent 4: Contraseña Olvidada**
- Training phrases:
  - "Olvidé mi contraseña"
  - "No puedo acceder"
  - "Recuperar contraseña"
  - "Resetear password"
  
- Response:
  - "Puedo ayudarte a recuperar tu contraseña. Por favor proporciona tu correo personal registrado en el sistema."

**Intent 5: Problemas Técnicos**
- Training phrases:
  - "Tengo un problema técnico"
  - "La intranet no funciona"
  - "Error al entrar"
  - "No puedo acceder al sistema"
  
- Response:
  - "Lamento que tengas problemas técnicos. Puedes contactar a soporte en: intranet@upt.pe o llamar al 952341082."

#### Paso 3: Guardar y Entrenar
1. Guarda cada intent
2. Haz clic en "Train" (botón superior derecho)
3. Espera que termine el entrenamiento (~2-3 minutos)

---

### **OPCIÓN 2: Usar NLP Local con más Intents/FAQs**

Si no quieres usar DialogFlow aún, mejora el sistema local:

#### Paso 1: Desactivar DialogFlow temporalmente

Edita `.env` en `nlp-service`:
```bash
USE_DIALOGFLOW=False
```

#### Paso 2: Agregar más FAQs locales

```bash
cd upt-chat-system/services/nlp-service
```

Edita `data/faqs.json` y agrega:

```json
[
  {
    "id": 1,
    "question": "¿Cuál es el horario de atención?",
    "answer": "El horario de atención es de 8:00 AM a 5:00 PM, de lunes a viernes.",
    "category": "general",
    "keywords": ["horario", "atención", "hora", "abierto"],
    "confidence": 0.9
  },
  {
    "id": 2,
    "question": "¿Cómo recupero mi contraseña?",
    "answer": "Puedo ayudarte a recuperar tu contraseña. Por favor proporciona tu correo personal registrado.",
    "category": "soporte",
    "keywords": ["contraseña", "password", "recuperar", "olvidé", "resetear"],
    "confidence": 0.95
  },
  {
    "id": 3,
    "question": "¿Cómo me matriculo?",
    "answer": "La matrícula se realiza online a través de la intranet del 1 al 15 de cada semestre. ¿Necesitas ayuda específica?",
    "category": "academico",
    "keywords": ["matrícula", "matricular", "inscribir", "registro"],
    "confidence": 0.9
  },
  {
    "id": 4,
    "question": "¿Dónde puedo ver mis notas?",
    "answer": "Puedes ver tus notas en la sección Académica de la intranet, opción 'Consulta de Notas'.",
    "category": "academico",
    "keywords": ["notas", "calificaciones", "promedio", "grades"],
    "confidence": 0.9
  },
  {
    "id": 5,
    "question": "Tengo un problema técnico",
    "answer": "Para problemas técnicos contacta a:\n• Intranet: intranet@upt.pe | 952341082\n• Office 365: 952341081\n• Google Meet: soportesuite@virtual.upt.pe",
    "category": "soporte",
    "keywords": ["problema", "error", "falla", "no funciona", "técnico"],
    "confidence": 0.85
  }
]
```

#### Paso 3: Reiniciar NLP Service

```bash
cd upt-chat-system/services/nlp-service
# Detener servicio (Ctrl+C)
# Reiniciar
uvicorn main:app --reload --port 8001
```

---

### **OPCIÓN 3: Sistema Híbrido (MEJOR)**

Usa DialogFlow + FAQs locales como fallback:

1. **Mantén DialogFlow activado**: `USE_DIALOGFLOW=True`
2. **Agrega Intents en DialogFlow** (Opción 1)
3. **Mejora FAQs locales** (Opción 2)

El sistema funciona así:
```
Usuario → NLP Service → DialogFlow (primero)
                     ↓
                   ¿confidence > 0.7?
                     ↓
              Sí → Respuesta DialogFlow
              No → Buscar en FAQs locales
                     ↓
                   ¿match encontrado?
                     ↓
              Sí → Respuesta FAQ
              No → "No entendí tu pregunta"
```

---

## 🧪 PRUEBAS DESPUÉS DE LA CONFIGURACIÓN

### Test 1: Prueba desde el navegador
1. Ve a `http://localhost:8000` (login page)
2. Haz clic en el chatbot
3. Escribe: "Hola"
4. Deberías ver: "¡Hola! Soy el asistente virtual de la UPT..."

### Test 2: Prueba directa del NLP Service
```bash
curl -X POST http://localhost:8001/api/v1/nlp/process \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hola",
    "session_id": "test-123",
    "language": "es"
  }'
```

Deberías ver una respuesta con `intent` detectado.

### Test 3: Verifica logs del NLP Service
```bash
cd upt-chat-system/services/nlp-service
tail -f logs/nlp-service.log
```

Busca líneas como:
```
✅ DialogFlow service ready
✅ Intent detected: greeting
✅ FAQ match found
```

---

## 🔍 DEBUGGING ADICIONAL

### Si aún no funciona:

#### 1. Verifica conexión a DialogFlow
```bash
cd upt-chat-system/services/nlp-service
python -c "
from google.cloud import dialogflow_v2
import os
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = 'credentials/dialogflow-credentials.json'
client = dialogflow_v2.SessionsClient()
print('✅ DialogFlow conectado correctamente')
"
```

#### 2. Revisa logs del API Gateway
```bash
cd upt-chat-system/services/api-gateway
# Busca errores en la consola donde corre el servicio
```

#### 3. Revisa Network en navegador
1. Abre DevTools (F12)
2. Tab "Network"
3. Escribe mensaje en chatbot
4. Busca la petición a `http://localhost:3000/api/v1/nlp/process`
5. Verifica el response

---

## 📊 EJEMPLO DE RESPUESTA ESPERADA

Cuando funcione correctamente, el NLP Service debe responder:

```json
{
  "success": true,
  "data": {
    "intent": "greeting",
    "confidence": 0.95,
    "response": "¡Hola! Soy el asistente virtual de la UPT. ¿En qué puedo ayudarte hoy?",
    "source": "dialogflow",
    "requires_validation": false
  }
}
```

Y el chatbot mostrará:
```
🤖 ¡Hola! Soy el asistente virtual de la UPT. ¿En qué puedo ayudarte hoy?
```

---

## 📝 RESUMEN DE ACCIONES

### ✅ ACCIÓN INMEDIATA (10 minutos)
1. Ve a DialogFlow Console
2. Crea los 5 intents básicos (copiar y pegar de arriba)
3. Entrena el modelo
4. Prueba en el chatbot

### ✅ ACCIÓN ALTERNATIVA (5 minutos)
1. Desactiva DialogFlow: `USE_DIALOGFLOW=False`
2. Agrega FAQs al archivo `data/faqs.json`
3. Reinicia NLP Service
4. Prueba en el chatbot

### ✅ VERIFICACIÓN
```bash
# Terminal 1: Ver logs NLP
cd upt-chat-system/services/nlp-service
tail -f logs/nlp-service.log

# Terminal 2: Probar chatbot
# Abre navegador en http://localhost:8000
# Prueba mensajes: "Hola", "Horarios", "Olvidé mi contraseña"
```

---

## 🎯 RESULTADO ESPERADO

Después de implementar cualquiera de las soluciones:

✅ El chatbot responderá coherentemente
✅ Los logs mostrarán intents detectados
✅ El confidence será > 0.7
✅ El usuario tendrá una conversación fluida

---

*Documento creado: 15 de octubre de 2025*
*Problema: Chatbot responde "no entendí tu pregunta"*
*Causa: DialogFlow sin intents + FAQs locales insuficientes*
