# 🔍 DIAGNÓSTICO COMPLETO DEL ERROR DEL CHATBOX
## Análisis realizado: 15 de octubre de 2025

---

## ❌ **SÍNTOMA DEL PROBLEMA**

```
Usuario escribe: "hola"
Bot responde: "🤖 Lo siento, no entendí tu pregunta. ¿Podrías reformularla?"
```

---

## 🔍 **ANÁLISIS DETALLADO**

### ✅ **LO QUE SÍ FUNCIONA**

| Componente | Estado | Puerto | Verificado |
|------------|--------|--------|------------|
| Frontend PHP | ✅ Running | 8000 | Sí |
| API Gateway | ✅ Running | 3000 | Sí |
| NLP Service | ✅ Running | 8001 | Sí |
| Notification Service | ✅ Running | 3005 | Sí |
| MongoDB Atlas | ✅ Connected | 27017 | Sí |
| MySQL Local | ✅ Connected | 3306 | Sí |

**Conclusión:** Toda la infraestructura está funcionando correctamente. ✅

---

### ❌ **PROBLEMA IDENTIFICADO**

#### **1. DialogFlow SIN INTENTS**

Tu captura de pantalla muestra:
```
Intents
┌─────────────────────────────────────┐
│ ○ Default Fallback Intent           │
│ ○ Default Welcome Intent             │
│                                      │
│ No regular intents yet.              │
│ Create the first one.                │
└─────────────────────────────────────┘
```

**Esto significa:**
- DialogFlow está configurado ✅
- Las credenciales son correctas ✅
- Pero NO tiene intents de UPT ❌

---

#### **2. FLUJO DEL ERROR**

```
┌──────────────────────────────────────────────────────────┐
│ 1. Usuario escribe "hola" en el chatbox                 │
└────────────────────┬─────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────┐
│ 2. chatbox.js envía a API Gateway                       │
│    POST http://localhost:3000/api/v1/nlp/process        │
└────────────────────┬─────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────┐
│ 3. API Gateway redirige a NLP Service                   │
│    POST http://localhost:8001/api/v1/nlp/process        │
└────────────────────┬─────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────┐
│ 4. NLP Service intenta procesar:                        │
│                                                          │
│    ┌─────────────────────────────────────┐             │
│    │ USE_DIALOGFLOW = True               │             │
│    └──────────────┬──────────────────────┘             │
│                   │                                      │
│                   ▼                                      │
│    ┌─────────────────────────────────────┐             │
│    │ Llama a DialogFlow API              │             │
│    │ con texto: "hola"                   │             │
│    └──────────────┬──────────────────────┘             │
│                   │                                      │
│                   ▼                                      │
│    ┌─────────────────────────────────────┐             │
│    │ DialogFlow responde:                │             │
│    │ Intent: "Default Fallback"          │ ❌          │
│    │ Confidence: 0.0                     │             │
│    │ (porque no tiene intents custom)    │             │
│    └──────────────┬──────────────────────┘             │
│                   │                                      │
│                   ▼                                      │
│    ┌─────────────────────────────────────┐             │
│    │ Confidence < 0.7 ?                  │             │
│    │ SÍ → Intenta buscar en FAQs locales │             │
│    └──────────────┬──────────────────────┘             │
│                   │                                      │
│                   ▼                                      │
│    ┌─────────────────────────────────────┐             │
│    │ Busca "hola" en faqs.json           │             │
│    │ NO ENCUENTRA match exacto           │ ❌          │
│    └──────────────┬──────────────────────┘             │
│                   │                                      │
│                   ▼                                      │
│    ┌─────────────────────────────────────┐             │
│    │ Retorna mensaje genérico:           │             │
│    │ "Lo siento, no entendí..."          │             │
│    └─────────────────────────────────────┘             │
│                                                          │
└────────────────────┬─────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────┐
│ 5. Respuesta regresa al chatbox                         │
│    Usuario ve: "🤖 Lo siento, no entendí tu pregunta"  │
└──────────────────────────────────────────────────────────┘
```

---

## 💡 **¿POR QUÉ NO FUNCIONAN LAS FAQs LOCALES?**

### **Datos disponibles:**
- `data/intents.json`: ✅ Tiene intents (saludo, despedida, etc.)
- `data/faqs.json`: ✅ Tiene 365+ FAQs

### **Problema:**
El matcher de FAQs locales busca coincidencias **exactas o muy similares** en las preguntas, pero:

```python
# Usuario escribe: "hola"
# FAQ tiene: "¿Cuándo son las inscripciones?"
# Match: NO ❌

# Usuario escribe: "cuando son las inscripciones"
# FAQ tiene: "¿Cuándo son las inscripciones?"
# Match: SÍ ✅
```

Para mensajes simples como "hola", **necesitas DialogFlow configurado**.

---

## ✅ **SOLUCIONES**

### **OPCIÓN 1: Configurar DialogFlow (20 minutos) - RECOMENDADO**

#### Paso 1: Ir a DialogFlow Console
```
https://dialogflow.cloud.google.com/
Proyecto: upt-chat-fhps
```

#### Paso 2: Crear Intents Básicos

Haz clic en "CREATE INTENT" y crea:

**Intent: greeting**
```
Training Phrases:
- Hola
- Buenos días
- Buenas tardes
- Hey
- Qué tal
- Saludos

Response:
¡Hola! 👋 Soy el asistente virtual de la UPT. 
¿En qué puedo ayudarte hoy?
```

**Intent: horarios**
```
Training Phrases:
- ¿Cuál es el horario de atención?
- ¿A qué hora atienden?
- Horarios
- ¿Cuándo están abiertos?

Response:
El horario de atención de la UPT es:
🕐 Lunes a Viernes: 8:00 AM - 5:00 PM
¿Necesitas información sobre algún área específica?
```

**Intent: inscripciones**
```
Training Phrases:
- ¿Cuándo son las inscripciones?
- Fechas de matrícula
- ¿Cómo me inscribo?
- Información de inscripción

Response:
Las inscripciones para el semestre 2025-II son del 15 al 31 de julio. 
Puedes inscribirte en: portal.upt.edu.pe
¿Necesitas más detalles sobre el proceso?
```

**Intent: password_reset**
```
Training Phrases:
- Olvidé mi contraseña
- No puedo acceder
- Recuperar contraseña
- Resetear password

Response:
Puedo ayudarte a recuperar tu contraseña. 
Por favor, proporciona tu correo personal registrado en el sistema.
```

**Intent: soporte_tecnico**
```
Training Phrases:
- Tengo un problema técnico
- La intranet no funciona
- Error al entrar
- Ayuda técnica

Response:
Para soporte técnico puedes contactar:
📧 Intranet: intranet@upt.pe | 📱 952341082
📧 Office 365: 952341081
📧 Google Meet: soportesuite@virtual.upt.pe

Horario: 8:00 - 17:00 hrs (L-V)
```

#### Paso 3: Entrenar
1. Guarda cada intent
2. Haz clic en "TRAIN" (esquina superior derecha)
3. Espera 2-3 minutos

#### Paso 4: Probar
En el panel derecho "Try it now", escribe:
- "Hola" → Debe responder el greeting
- "Horarios" → Debe responder horarios

---

### **OPCIÓN 2: Usar Solo FAQs Locales (5 minutos) - RÁPIDO**

#### Ejecutar el script automático:

```bash
cd /home/desci/Documentos/constru
./fix_chatbox.sh
```

Este script:
1. Desactiva DialogFlow (`USE_DIALOGFLOW=False`)
2. Reinicia NLP Service
3. Prueba que funciona con FAQs locales

#### Limitación:
Solo responderá preguntas **muy específicas**:
- ✅ "¿Cuándo son las inscripciones?"
- ✅ "¿Cuánto cuesta la matrícula?"
- ❌ "Hola" (muy genérico)
- ❌ "Ayuda" (muy genérico)

---

### **OPCIÓN 3: Híbrido (30 minutos) - ÓPTIMO**

1. Configura intents básicos en DialogFlow (Opción 1)
2. Mantén FAQs locales como fallback
3. El sistema usará ambos:
   - DialogFlow para mensajes generales
   - FAQs locales para info específica de UPT

---

## 🧪 **CÓMO PROBAR QUE FUNCIONA**

### Test 1: Desde el navegador
```bash
1. Abre http://localhost:8000
2. Login: demo / demo123
3. Click en chatbox
4. Escribe: "Hola"
5. Debe responder: "¡Hola! 👋 Soy el asistente virtual..."
```

### Test 2: Directo a NLP Service
```bash
curl -X POST http://localhost:8001/api/v1/nlp/process \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hola",
    "session_id": "test-123",
    "language": "es"
  }'
```

Respuesta esperada:
```json
{
  "success": true,
  "data": {
    "intent": "greeting",
    "confidence": 0.95,
    "response": "¡Hola! 👋 Soy el asistente virtual de la UPT...",
    "source": "dialogflow"
  }
}
```

### Test 3: Ver logs
```bash
cd upt-chat-system/services/nlp-service
tail -f logs/nlp-service.log
```

Busca:
```
✅ DialogFlow service ready
✅ Intent detected: greeting
✅ Confidence: 0.95
```

---

## 📊 **COMPARACIÓN DE OPCIONES**

| Característica | Opción 1<br/>DialogFlow | Opción 2<br/>FAQs Local | Opción 3<br/>Híbrido |
|----------------|-------------------------|-------------------------|----------------------|
| Tiempo setup | 20 min | 5 min | 30 min |
| Comprende "Hola" | ✅ Sí | ❌ No | ✅ Sí |
| Preguntas específicas | ✅ Sí | ✅ Sí | ✅ Sí |
| Aprende automáticamente | ✅ Sí | ❌ No | ✅ Sí |
| Funciona offline | ❌ No | ✅ Sí | ⚠️ Parcial |
| Escalabilidad | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| Mantenimiento | Bajo | Alto | Medio |

**Recomendación:** Opción 3 (Híbrido) ⭐

---

## 🔧 **COMANDOS ÚTILES**

### Reiniciar NLP Service
```bash
cd upt-chat-system/services/nlp-service
pkill -f "uvicorn main:app"
uvicorn main:app --reload --port 8001
```

### Ver configuración actual
```bash
cd upt-chat-system/services/nlp-service
cat .env | grep DIALOGFLOW
```

### Activar/Desactivar DialogFlow
```bash
# Desactivar
sed -i 's/USE_DIALOGFLOW=True/USE_DIALOGFLOW=False/' .env

# Activar
sed -i 's/USE_DIALOGFLOW=False/USE_DIALOGFLOW=True/' .env
```

### Ver todos los servicios
```bash
cd /home/desci/Documentos/constru
./status.sh
```

---

## 📝 **RESUMEN EJECUTIVO**

### **Causa raíz:**
DialogFlow está configurado pero **vacío** (sin intents custom).

### **Por qué pasa:**
El NLP Service intenta usar DialogFlow primero, este no reconoce "hola" y retorna fallback con confidence 0. Luego busca en FAQs pero no encuentra match para saludos simples.

### **Solución inmediata:**
```bash
cd /home/desci/Documentos/constru
./fix_chatbox.sh
```

### **Solución definitiva:**
Configurar intents en DialogFlow Console (20 minutos).

---

## 🎯 **RESULTADO ESPERADO**

**Después de la solución:**

```
Usuario: hola
Bot: ¡Hola! 👋 Soy el asistente virtual de la UPT. ¿En qué puedo ayudarte hoy?

Usuario: cuando son las inscripciones
Bot: Las inscripciones para el semestre 2025-II son del 15 al 31 de julio. 
     Puedes inscribirte en: portal.upt.edu.pe ¿Necesitas más detalles?

Usuario: olvide mi contraseña
Bot: Puedo ayudarte a recuperar tu contraseña. 
     Por favor, proporciona tu correo personal registrado en el sistema.
```

**Logs esperados:**
```
INFO: Intent detected: greeting | Confidence: 0.95 | Source: dialogflow
INFO: FAQ match found: inscripciones.fechas | Score: 0.89
INFO: Sensitive query detected: password_reset | Validation required
```

---

*Diagnóstico creado: 15 de octubre de 2025, 03:30 AM*
*Analista: GitHub Copilot*
*Proyecto: UPT Chat System*
