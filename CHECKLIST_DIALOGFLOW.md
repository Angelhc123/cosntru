# ✅ CHECKLIST POST-CREACIÓN DE INTENTS

## 📋 **PASO CRÍTICO QUE FALTA**

Después de crear los intents en DialogFlow Console, **DEBES**:

### **1. ENTRENAR EL MODELO** ⭐⭐⭐ MUY IMPORTANTE

#### En DialogFlow Console:

```
┌─────────────────────────────────────────┐
│  [🔍 Search]  [⚙️ Settings]  [TRAIN] 🔵 │ ← Haz clic aquí
└─────────────────────────────────────────┘
```

**Ubicación:** Esquina **superior derecha** de la pantalla

**Pasos:**
1. Haz clic en el botón azul **"TRAIN"**
2. Verás un mensaje: "Training agent..."
3. Espera **2-3 minutos** (puede tomar hasta 5 minutos)
4. El botón cambiará de color cuando termine

---

### **2. VERIFICAR EN "TRY IT NOW"**

#### En el panel derecho de DialogFlow:

```
┌──────────────────────────┐
│   Try it now             │
│                          │
│  [Type something...]     │ ← Escribe "Hola" aquí
│                          │
└──────────────────────────┘
```

**Qué deberías ver:**
```
User says: Hola

Intent: greeting
Confidence: 0.95

Bot says:
¡Hola! 👋 Soy el asistente virtual de la UPT. 
¿En qué puedo ayudarte hoy?
```

---

### **3. SI FUNCIONA EN DIALOGFLOW PERO NO EN EL CHATBOX**

Ejecuta este comando:

```bash
cd ~/Documentos/constru
./test_dialogflow.sh
```

Deberías ver:
```
Intent detectado: greeting
Confidence: 0.95
✅ DialogFlow está funcionando correctamente!
```

---

### **4. SI AÚN NO FUNCIONA**

#### Verifica que el intent tenga este formato:

**❌ INCORRECTO:**
- Intent name vacío
- Solo 1-2 training phrases
- Response vacía
- No guardaste con "SAVE"
- **NO HICISTE CLIC EN "TRAIN"** ← Causa #1 de problemas

**✅ CORRECTO:**
- Intent name: `greeting` (sin espacios, minúsculas)
- Training phrases: Mínimo 5-7 ejemplos
- Response: Texto completo con emojis
- Guardaste con "SAVE"
- **HICISTE CLIC EN "TRAIN" Y ESPERASTE** ← CRÍTICO

---

## 🔄 **TIEMPO DE PROPAGACIÓN**

Después de hacer TRAIN:
- **Inmediato**: Funciona en "Try it now" de DialogFlow
- **2-3 minutos**: Funciona via API (tu chatbox)
- **5 minutos**: Totalmente propagado en todos los servidores

---

## 🧪 **PRUEBAS PASO A PASO**

### Test 1: En DialogFlow Console
```
1. Ve a https://dialogflow.cloud.google.com/
2. Proyecto: upt-chat-fhps
3. Panel derecho "Try it now"
4. Escribe: "Hola"
5. ¿Responde correctamente? → Continúa al Test 2
   ¿No responde? → Revisa los intents y haz TRAIN
```

### Test 2: Desde terminal
```bash
cd ~/Documentos/constru
./test_dialogflow.sh
```

Busca:
```
Intent detectado: greeting
Confidence: 0.95
```

### Test 3: En el navegador (chatbox real)
```
1. Abre http://localhost:8000
2. Login: demo / demo123
3. Click en chatbox
4. Escribe: "Hola"
5. Debe responder: "¡Hola! 👋 Soy el asistente virtual..."
```

---

## 📸 **CAPTURAS DE PANTALLA QUE DEBES VER**

### En DialogFlow Console después de TRAIN:

```
┌──────────────────────────────────────────┐
│  Intents                                 │
├──────────────────────────────────────────┤
│  ○ Default Fallback Intent               │
│  ○ Default Welcome Intent                │
│  ● greeting                    [Edit]    │ ← Verde = Activo
│  ● horarios_atencion          [Edit]    │
│  ● inscripciones              [Edit]    │
│  ● recuperar_contrasena       [Edit]    │
│  ● soporte_tecnico            [Edit]    │
└──────────────────────────────────────────┘
```

### En Try it now:

```
User says: Hola

┌──────────────────────────────────────┐
│ Intent: greeting                     │ ← Debe aparecer
│ Confidence: 0.95                     │ ← Alto confidence
└──────────────────────────────────────┘

¡Hola! 👋 Soy el asistente virtual de la UPT...
```

---

## ⚠️ **ERRORES COMUNES**

| Error | Causa | Solución |
|-------|-------|----------|
| Intent null | No entrenado | Clic en TRAIN |
| Confidence 0.3 | Intent no existe | Verificar que se guardó |
| Default Fallback | Training phrases insuficientes | Agregar más ejemplos |
| No responde | No esperaste | Esperar 2-3 minutos después de TRAIN |

---

## 🎯 **RESUMEN: LO MÁS IMPORTANTE**

### Después de crear CADA intent:

1. ✅ Guardar (SAVE)
2. ⭐ **ENTRENAR (TRAIN)** ← ESTO ES LO QUE FALTA
3. ⏳ Esperar 2-3 minutos
4. 🧪 Probar en "Try it now"
5. ✅ Probar en el chatbox

---

*Si hiciste clic en TRAIN y esperaste 3 minutos, ejecuta:*
```bash
~/Documentos/constru/test_dialogflow.sh
```

*Debería funcionar. Si no, avísame y revisamos los logs en detalle.*
