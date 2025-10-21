# 🚀 GUÍA VISUAL: ACTIVAR WEBHOOK EN DIALOGFLOW

## ✅ ngrok YA ESTÁ INSTALADO

Ahora necesitas seguir estos pasos:

---

## 📋 PASOS RÁPIDOS (15 minutos)

### **PASO 1: Registrarse en ngrok (GRATIS)**

1. Abre tu navegador
2. Ve a: **https://dashboard.ngrok.com/signup**
3. Regístrate con tu Gmail (es gratis)
4. Confirma tu email
5. Ve a: **https://dashboard.ngrok.com/get-started/your-authtoken**
6. Copia el authtoken (es como: `2abc...xyz123`)

---

### **PASO 2: Configurar authtoken en tu computadora**

Abre una terminal y ejecuta:

```bash
ngrok config add-authtoken TU_TOKEN_AQUI
```

Reemplaza `TU_TOKEN_AQUI` con el token que copiaste.

Verás:
```
Authtoken saved to configuration file: /home/desci/.config/ngrok/ngrok.yml
```

---

### **PASO 3: Iniciar servicios (4 terminales)**

#### **Terminal 1: ProyectoTest PHP**
```bash
cd /home/desci/Documentos/constru/proyectotest
php -S localhost:8000
```
Espera a ver: `Listening on http://localhost:8000`

---

#### **Terminal 2: API Gateway**
```bash
cd /home/desci/Documentos/constru/upt-chat-system/services/api-gateway
npm run start:dev
```
Espera a ver: `API Gateway ejecutándose en: http://localhost:3000`

---

#### **Terminal 3: NLP Service**
```bash
cd /home/desci/Documentos/constru/upt-chat-system/services/nlp-service
python main.py
```
Espera a ver: `Uvicorn running on http://0.0.0.0:8001`

---

#### **Terminal 4: ngrok (El más importante para DialogFlow)**
```bash
ngrok http 8001
```

Verás algo como esto:

```
┌───────────────────────────────────────────────────┐
│ Session Status  │ online                          │
│ Account         │ tu_email@gmail.com              │
│ Version         │ 3.5.0                           │
│ Region          │ United States (us)              │
│ Forwarding      │ https://abc123.ngrok.io -> http│
│                 │ ://localhost:8001               │
└───────────────────────────────────────────────────┘
```

**¡IMPORTANTE!** Copia la URL HTTPS que aparece:
```
https://abc123.ngrok.io
```
⬆️ Esta es TU URL única. La necesitas para el siguiente paso.

---

### **PASO 4: Probar que ngrok funciona**

En una quinta terminal (o en tu navegador), prueba:

```bash
curl https://tu-url-ngrok.ngrok.io/webhook/health
```

**Debes ver:**
```json
{
  "status": "healthy",
  "service": "nlp-service-webhook",
  "api_gateway_url": "http://localhost:3000"
}
```

✅ Si ves esto, ngrok está funcionando correctamente.

---

### **PASO 5: Configurar DialogFlow**

#### **5.1 - Configurar Webhook Global**

1. En DialogFlow Console, ve al menú izquierdo
2. Click en **"Fulfillment"** (el ícono del rayo ⚡)
3. Activa el toggle **"Webhook"** (debe quedar ENABLED en azul)
4. En el campo **"URL"**, pega tu URL de ngrok + `/webhook`:
   ```
   https://abc123.ngrok.io/webhook
   ```
   ⬆️ Reemplaza `abc123` con tu URL real de ngrok

5. **NO** configures BASIC AUTH (déjalo vacío)
6. Scroll down y click en **"SAVE"** (botón azul al final)

---

#### **5.2 - Configurar el Intent "Contraseña Olvidada"**

1. En DialogFlow Console, ve a **"Intents"** (menú izquierdo)
2. Click en tu intent **"Contraseña Olvidada"**
3. Verifica que tenga estas configuraciones:

**Training phrases:** (deben estar sin emails)
```
✅ Olvidé mi contraseña
✅ Resetear password
✅ Recuperar contraseña
✅ No puedo acceder
```

**Action and parameters:**
```
┌────────────────────────────────────────────────┐
│ REQUIRED ☑ | PARAMETER | ENTITY    | VALUE    │
│    ☑       |   email   | @sys.email| $email   │
└────────────────────────────────────────────────┘

Prompts:
• "Por favor, proporciona tu correo personal"
• "¿Cuál es tu email personal?"
```

4. **Scroll down** hasta encontrar la sección **"Fulfillment"**
5. Activa el checkbox: **☑ Enable webhook call for this intent**
6. Click en **"SAVE"** (botón azul arriba a la derecha)

---

### **PASO 6: ¡PROBAR!**

#### **Test en DialogFlow Console**

1. En DialogFlow Console, busca el panel derecho que dice **"Try it now"**
2. Escribe: `Olvidé mi contraseña`
3. **Esperado:**
   ```
   Intent detected: Contraseña Olvidada
   DialogFlow: "Por favor, proporciona tu correo personal"
   ```

4. Escribe: `juan.perez@gmail.com`
5. **Esperado:**
   ```
   DialogFlow llama al webhook (tu ngrok)
   Respuesta: "Perfecto, Juan Pérez García. He enviado un correo 
              electrónico a juan.perez@gmail.com..."
   ```

#### **Ver logs en tiempo real**

En la terminal 3 (donde corre NLP Service), verás:

```
INFO:     📨 Webhook recibido de DialogFlow
INFO:     🎯 Intent detectado: Contraseña Olvidada
INFO:     📋 Parámetros: {'email': 'juan.perez@gmail.com'}
INFO:     🔍 Verificando email personal: juan.perez@gmail.com
INFO:     ✅ Email encontrado - Usuario: 2020068376
INFO:     ✅ Proceso de recuperación iniciado exitosamente
```

En la terminal 4 (ngrok), verás las requests:

```
HTTP Requests
-------------

POST /webhook                  200 OK
GET  /webhook/health           200 OK
```

---

## 🎯 RESUMEN VISUAL DEL FLUJO

```
1. Usuario escribe en DialogFlow: "Olvidé mi contraseña"
                    ↓
2. DialogFlow detecta intent y solicita email
                    ↓
3. Usuario: "juan.perez@gmail.com"
                    ↓
4. DialogFlow hace POST a: https://tu-ngrok.ngrok.io/webhook
                    ↓
5. ngrok reenvía a: http://localhost:8001/webhook
                    ↓
6. NLP Service procesa → llama API Gateway (port 3000)
                    ↓
7. API Gateway → ProyectoTest PHP (port 8000)
                    ↓
8. ProyectoTest verifica email en MySQL
                    ↓
9. Respuesta: Email existe → Generar contraseña → Enviar email
                    ↓
10. Respuesta a DialogFlow: "Perfecto, Juan Pérez..."
```

---

## ⚠️ IMPORTANTE: ngrok en versión GRATIS

Con la versión gratuita de ngrok:

✅ **Funciona perfectamente** para desarrollo
✅ Puedes probar tu webhook con DialogFlow
✅ Sin límite de requests para pruebas

❌ La URL cambia cada vez que reinicias ngrok
❌ Si cierras ngrok, DialogFlow no podrá conectarse

**Solución:** Mantén ngrok corriendo mientras pruebas.

Si reinicias ngrok y obtienes una nueva URL:
1. Copia la nueva URL: `https://xyz789.ngrok.io`
2. Ve a DialogFlow → Fulfillment
3. Actualiza la URL: `https://xyz789.ngrok.io/webhook`
4. Click SAVE

---

## 🐛 TROUBLESHOOTING

### **Problema: "ngrok: command not found"**
**Solución:**
```bash
# Verificar instalación
which ngrok

# Si no está, reinstalar:
cd /tmp
wget https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-amd64.tgz
tar xzf ngrok-v3-stable-linux-amd64.tgz
sudo mv ngrok /usr/local/bin/
```

---

### **Problema: "ERR_NGROK_108" (authtoken inválido)**
**Solución:**
1. Verifica tu token en: https://dashboard.ngrok.com/get-started/your-authtoken
2. Configúralo de nuevo: `ngrok config add-authtoken TU_TOKEN`

---

### **Problema: DialogFlow dice "Webhook call failed"**
**Solución:**
1. Verifica que ngrok esté corriendo
2. Verifica que NLP Service esté corriendo: `curl http://localhost:8001/health`
3. Prueba la URL de ngrok: `curl https://tu-url.ngrok.io/webhook/health`
4. Revisa logs del NLP Service

---

### **Problema: "Email no encontrado" pero existe en BD**
**Solución:**
1. Verifica que API Gateway esté corriendo (port 3000)
2. Verifica que ProyectoTest PHP esté corriendo (port 8000)
3. Prueba el flujo manualmente:
   ```bash
   curl -X POST http://localhost:3000/api/v1/password-reset/verify-email \
     -H "Content-Type: application/json" \
     -d '{"emailPersonal":"juan.perez@gmail.com"}'
   ```

---

## 📊 CHECKLIST FINAL

- [ ] ngrok instalado (`which ngrok` debe mostrar la ruta)
- [ ] Authtoken configurado
- [ ] ProyectoTest PHP corriendo (port 8000)
- [ ] API Gateway corriendo (port 3000)
- [ ] NLP Service corriendo (port 8001)
- [ ] ngrok corriendo y mostrando URL HTTPS
- [ ] DialogFlow Fulfillment con URL de ngrok configurada
- [ ] Intent "Contraseña Olvidada" con webhook enabled
- [ ] Test en DialogFlow Console: funciona ✅

---

## 🎉 ¡LISTO!

Una vez que completes todos los pasos, tendrás:

✅ DialogFlow conectado a tu localhost via ngrok
✅ Webhook funcionando con HTTPS
✅ Flujo completo de recuperación de contraseña operativo
✅ Integración NLP Service ↔ API Gateway ↔ ProyectoTest PHP

**Siguiente paso:** Configurar el Notification Service para enviar emails reales.

---

**¿Necesitas ayuda con algún paso específico?**
