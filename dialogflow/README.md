# Guía completa: Entrenar intents en Dialogflow con webhook fulfillment

## 1) CONFIGURAR INTENTS CON TRAINING PHRASES

### Intent: "Contraseña Olvidada"
**Training phrases:** (copia del archivo `training_phrases.md`)
- Olvidé mi contraseña
- No recuerdo mi contraseña de intranet
- ¿Cómo recupero mi contraseña de la intranet?

**Action and parameters:**
- Action name: `password.recovery`
- Parámetros:
  - `email` (entity: @sys.email, required: true)
  - Prompt: "¿Cuál es tu correo institucional para enviarte el enlace de recuperación?"

**Fulfillment:**
- ✅ Enable webhook call for this intent
- El webhook recibirá: `{ "intent": "Contraseña Olvidada", "parameters": { "email": "usuario@upt.edu" } }`

---

### Intent: "Contraseña Institucional"  
**Training phrases:**
- No puedo entrar a mi cuenta institucional
- Problemas con mi contraseña institucional
- Mi cuenta institucional no funciona

**Action and parameters:**
- Action name: `institutional.access`
- Parámetros:
  - `student_name` (entity: @sys.person, required: true)
  - `issue_type` (entity: @sys.any, optional)
  - Prompt: "¿Cuál es tu nombre completo para generar el ticket de soporte?"

**Fulfillment:**
- ✅ Enable webhook call for this intent
- ✅ **ESCALATE = TRUE** (el webhook debe crear ticket automáticamente)

---

### Intent: "Problemas Técnicos"
**Training phrases:**
- Tengo un problema técnico
- No funciona la plataforma
- La página me da error

**Action and parameters:**
- Action name: `technical.support`
- Parámetros:
  - `issue_description` (entity: @sys.any, required: true)
  - Prompt: "Describe brevemente el problema técnico que tienes"

**Fulfillment:**
- ✅ Enable webhook call for this intent
- ✅ **ESCALATE = TRUE** (crear ticket automáticamente)

---

## 2) CONFIGURAR WEBHOOK FULFILLMENT

**URL del webhook:** `https://nlp-service-production-3f94.up.railway.app/webhook`

El webhook debe responder así:
```json
{
  "fulfillmentText": "Procesando tu solicitud...",
  "fulfillmentMessages": [
    {
      "text": {
        "text": ["He procesado tu solicitud. Te contactaremos pronto."]
      }
    }
  ],
  "payload": {
    "escalate": true,  // Solo para intents que escalan
    "intent_name": "Contraseña Institucional",
    "action": "institutional.access", 
    "parameters": {
      "student_name": "Juan Pérez",
      "issue_type": "contraseña bloqueada"
    }
  }
}
```

## 3) ENLAZAR FAQs EN API
```bash
./scripts/seed_faqs_with_intents.sh https://api-gateway-production-f25f.up.railway.app/api/v1
```

4. PROBAR ESCALAMIENTO
1. Envía mensaje: "No puedo entrar a mi cuenta institucional, soy Juan Pérez"
2. Dialogflow detecta intent → llama webhook
3. Webhook valida `escalate: true` → crea ticket
4. Verifica en `/api/v1/tickets` o `/api/notifications`

## 5) VERIFICAR EN ANALYTICS
- `GET /api/v1/analytics/intents/top` debe mostrar el intent en español
- Los intents con `escalate: true` aparecen en métricas de escalamiento

**Próximo paso:** Configurar el endpoint `/webhook` en el NLP service para manejar estos casos.
