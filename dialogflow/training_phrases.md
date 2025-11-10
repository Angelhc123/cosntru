# Frases de entrenamiento para Dialogflow (intents principales)

Este archivo contiene frases sugeridas para entrenar los intents en Dialogflow ES (puedes copiarlas en el Console > Intents).

## 1) Intent: Contraseña Olvidada
- Olvidé mi contraseña
- No recuerdo mi contraseña de intranet
- ¿Cómo recupero mi contraseña de la intranet?
- No puedo entrar con mi contraseña
- Perdí mi contraseña del portal interno
- Necesito restablecer la contraseña de mi cuenta interna
- Se me olvidó la clave de acceso
- No me acuerdo de mi password
- Mi correo es juan@upt.edu y olvidé mi clave
- Necesito resetear la contraseña de maria@upt.edu

**Action and parameters:**
- Action name: `password.recovery`
- Parámetro: `email` (entity: @sys.email, required: true)
- Prompt: "¿Cuál es tu correo institucional?"

**Fulfillment:** ✅ Enable webhook call for this intent

Escalamiento: false (pero usa webhook para enviar email automático)

---

## 2) Intent: Contraseña Institucional
- No puedo entrar a mi cuenta institucional
- Problemas con mi contraseña institucional
- Mi cuenta institucional no funciona
- Perdí la contraseña de mi cuenta institucional
- No me deja entrar al sistema institucional
- Problemas de acceso institucional
- Mi usuario institucional está bloqueado
- No recuerdo mi contraseña institucional
- No puedo acceder institucionalmente
- Mi cuenta institucional no me reconoce

**Action and parameters:**
- Action name: `institutional.access`
- Parámetro: `student_name` (entity: @sys.person, required: true)
- Parámetro: `issue_type` (entity: @sys.any, optional)
- Prompt: "¿Cuál es tu nombre completo para generar el ticket de soporte?"

**Fulfillment:** ✅ Enable webhook call for this intent

Escalamiento: true (crear ticket automático en soporte institucional)

---

## 3) Intent: Problemas Técnicos
- Tengo un problema técnico
- No funciona la plataforma
- La página me da error
- Problemas técnicos con la intranet
- Se cayó el sistema
- Error en el sistema
- La plataforma no responde
- Falla técnica
- Bug en la página
- No puedo acceder por error técnico
- La página me sale error 500
- No puedo subir archivos al sistema

**Action and parameters:**
- Action name: `technical.support`
- Parámetro: `issue_description` (entity: @sys.any, required: true)
- Prompt: "Describe el problema técnico que tienes"

**Fulfillment:** ✅ Enable webhook call for this intent

Escalamiento: true (crear ticket automático en soporte técnico)

---

## 4) Intent: Horarios de Atención
- ¿Cuáles son los horarios de atención?
- Horarios de atención
- ¿A qué hora atienden?
- ¿Cuándo están abiertos?
- Horario de la oficina
- ¿Hasta qué hora atienden?

**Action and parameters:** ❌ NO necesita (respuesta directa)

**Responses (texto fijo):**
- "Nuestros horarios de atención son de lunes a viernes de 8:00 AM a 6:00 PM."

**Fulfillment:** ❌ NO enable webhook (usa respuesta directa)

Escalamiento: false

---

## 5) Intent: Información de Matrícula
- Información sobre matrícula
- ¿Cómo me matriculo?
- Proceso de matrícula
- ¿Qué necesito para matricularme?
- Documentos para matrícula

**Action and parameters:** ❌ NO necesita (respuesta directa)

**Responses (texto fijo):**
- "Para la matrícula necesitas cédula, certificado de bachillerato y comprobante de pago. Puedes iniciar el proceso en línea o acercarte a la oficina de admisiones."

**Fulfillment:** ❌ NO enable webhook (usa respuesta directa)

Escalamiento: false

---

## 6) Intent: Saludos
- Hola
- Buenas
- Buenas tardes
- Hola, ¿qué tal?
- Buenos días
- Saludos

**Action and parameters:** ❌ NO necesita (respuesta directa)

**Responses (texto fijo):**
- "¡Hola! ¿En qué puedo ayudarte hoy?"

**Fulfillment:** ❌ NO enable webhook (usa respuesta directa)

Escalamiento: false

---

Notas:
- Añade varias variaciones (typos, preguntas largas, frases formales e informales).
- Para intents que escalan normaliza un parámetro 'escalate' a true en el metadata del intent o guarda el intent_name en la FAQ con escalate=true.
