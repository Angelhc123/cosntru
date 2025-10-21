# 🎯 CONFIGURACIÓN SIMPLE DE DIALOGFLOW (Para ti)

## ✅ LO QUE TIENES QUE HACER EN DIALOGFLOW

### **Intent: "Contraseña Olvidada"**

#### **1. Training Phrases** (Frases de entrenamiento)
```
Olvidé mi contraseña
Resetear password
Recuperar contraseña  
No recuerdo mi contraseña
Perdí mi clave
No puedo acceder a mi cuenta
```

**¡IMPORTANTE!** NO agregues frases con emails. Solo frases simples.

---

#### **2. Action and parameters**

**BORRA el parámetro "email" si lo tienes** ❌

No necesitas parámetros. El webhook manejará todo.

---

#### **3. Responses**

**VACÍO** - No pongas nada aquí.

---

#### **4. Fulfillment**

✅ **Enable webhook call for this intent** (activado)

---

## 🧪 PRUEBA

Después de configurar:

1. **En DialogFlow "Try it now":**
   ```
   Tú: "Olvidé mi contraseña"
   Bot: "Puedo ayudarte a recuperar tu contraseña. Por favor proporciona tu correo..."
   
   Tú: "juan.perez@gmail.com"  
   Bot: "Lo siento, el correo... no está registrado"
   ```

2. **En la página de prueba:**
   ```
   http://localhost:8000/test_password_recovery.html
   ```

---

## 📝 RESUMEN

- ✅ Training phrases: Solo frases simples SIN emails
- ❌ Parameters: NO necesitas (borra "email" si existe)
- ❌ Responses: VACÍO
- ✅ Fulfillment: ACTIVADO
- ✅ Webhook URL: Ya está configurado

**El webhook hace TODO el trabajo del flujo conversacional por código.**

