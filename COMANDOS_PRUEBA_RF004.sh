#!/bin/bash

# 🚀 COMANDOS DE PRUEBA RF004
# Copia y pega estos comandos para probar la implementación

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║          🔐 COMANDOS DE PRUEBA RF004                          ║"
echo "║        Recuperación de Contraseña por Email Personal          ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# ============================================================================
# SECCIÓN 1: INICIAR SERVICIOS
# ============================================================================

cat << 'EOF'
═══════════════════════════════════════════════════════════════
 1️⃣  INICIAR SERVICIOS (Abrir 4 terminales)
═══════════════════════════════════════════════════════════════

Terminal 1 - ProyectoTest PHP:
----------------------------
cd /home/desci/Documentos/constru/proyectotest
php -S localhost:8000

Terminal 2 - API Gateway:
----------------------------
cd /home/desci/Documentos/constru/upt-chat-system/services/api-gateway
npm install
npm run start:dev

Terminal 3 - NLP Service:
----------------------------
cd /home/desci/Documentos/constru/upt-chat-system/services/nlp-service
pip install -r requirements.txt
python main.py

Terminal 4 - Notification Service:
----------------------------
cd /home/desci/Documentos/constru/upt-chat-system/services/notification-service
npm install
npm run start:dev

EOF

# ============================================================================
# SECCIÓN 2: PRUEBAS DE CONECTIVIDAD
# ============================================================================

cat << 'EOF'
═══════════════════════════════════════════════════════════════
 2️⃣  VERIFICAR CONECTIVIDAD DE SERVICIOS
═══════════════════════════════════════════════════════════════

Verificar ProyectoTest PHP:
----------------------------
curl http://localhost:8000/public/test_connection.php

Verificar API Gateway:
----------------------------
curl http://localhost:3000/health

Verificar Base de Datos MySQL:
----------------------------
mysql -h bj7lnbakskgcgngpmtma-mysql.services.clever-cloud.com \
  -u u7imxhdxstbw6uuy \
  -p \
  -P 3306 \
  bj7lnbakskgcgngpmtma \
  -e "SELECT COUNT(*) as total_usuarios FROM usuarios;"

EOF

# ============================================================================
# SECCIÓN 3: PRUEBAS PHP API (Directo)
# ============================================================================

cat << 'EOF'
═══════════════════════════════════════════════════════════════
 3️⃣  PRUEBAS DE PHP API (Conexión Directa)
═══════════════════════════════════════════════════════════════

Test 1: Verificar Email Existente (Estudiante)
----------------------------
curl -X POST http://localhost:8000/public/api_verify_email.php \
  -H "Content-Type: application/json" \
  -d '{"email_personal":"juan.perez@gmail.com"}' | jq

# Esperado: success=true, usuario=2020068376

Test 2: Verificar Email Existente (Docente)
----------------------------
curl -X POST http://localhost:8000/public/api_verify_email.php \
  -H "Content-Type: application/json" \
  -d '{"email_personal":"maria.rodriguez@gmail.com"}' | jq

# Esperado: success=true, usuario=prof001

Test 3: Verificar Email NO Existente
----------------------------
curl -X POST http://localhost:8000/public/api_verify_email.php \
  -H "Content-Type: application/json" \
  -d '{"email_personal":"noexiste@gmail.com"}' | jq

# Esperado: success=false, message="Email personal no encontrado"

Test 4: Actualizar Contraseña
----------------------------
curl -X POST http://localhost:8000/public/api_update_password.php \
  -H "Content-Type: application/json" \
  -d '{
    "usuario":"2020068376",
    "new_password":"TestPassword123!"
  }' | jq

# Esperado: success=true, message="Contraseña actualizada correctamente"

EOF

# ============================================================================
# SECCIÓN 4: PRUEBAS API GATEWAY
# ============================================================================

cat << 'EOF'
═══════════════════════════════════════════════════════════════
 4️⃣  PRUEBAS DE API GATEWAY (Integración)
═══════════════════════════════════════════════════════════════

Test 1: Verificar Email via API Gateway
----------------------------
curl -X POST http://localhost:3000/api/v1/password-reset/verify-email \
  -H "Content-Type: application/json" \
  -d '{"emailPersonal":"juan.perez@gmail.com"}' | jq

# Esperado: exists=true, usuario="2020068376"

Test 2: Iniciar Proceso de Recuperación
----------------------------
curl -X POST http://localhost:3000/api/v1/password-reset/initiate \
  -H "Content-Type: application/json" \
  -d '{
    "emailPersonal":"juan.perez@gmail.com",
    "sessionId":"test-session-001"
  }' | jq

# Esperado: success=true, token="...", message="Email de confirmación enviado"

Test 3: Consultar Estado de Recuperación
----------------------------
curl http://localhost:3000/api/v1/password-reset/status/test-session-001 | jq

# Esperado: status="pending" o "confirmed"

EOF

# ============================================================================
# SECCIÓN 5: CONSULTAS A BASE DE DATOS
# ============================================================================

cat << 'EOF'
═══════════════════════════════════════════════════════════════
 5️⃣  CONSULTAS DIRECTAS A BASE DE DATOS
═══════════════════════════════════════════════════════════════

Listar Todos los Usuarios con Email Personal:
----------------------------
mysql -h bj7lnbakskgcgngpmtma-mysql.services.clever-cloud.com \
  -u u7imxhdxstbw6uuy \
  -p \
  -P 3306 \
  bj7lnbakskgcgngpmtma \
  -e "SELECT usuario, email_personal, nombre_completo, tipo_usuario FROM usuarios;"

Buscar Usuario por Email Personal:
----------------------------
mysql -h bj7lnbakskgcgngpmtma-mysql.services.clever-cloud.com \
  -u u7imxhdxstbw6uuy \
  -p \
  -P 3306 \
  bj7lnbakskgcgngpmtma \
  -e "SELECT * FROM usuarios WHERE email_personal = 'juan.perez@gmail.com'\G"

Ver Últimas Actualizaciones:
----------------------------
mysql -h bj7lnbakskgcgngpmtma-mysql.services.clever-cloud.com \
  -u u7imxhdxstbw6uuy \
  -p \
  -P 3306 \
  bj7lnbakskgcgngpmtma \
  -e "SELECT usuario, nombre_completo, updated_at FROM usuarios ORDER BY updated_at DESC LIMIT 5;"

Contar Usuarios por Tipo:
----------------------------
mysql -h bj7lnbakskgcgngpmtma-mysql.services.clever-cloud.com \
  -u u7imxhdxstbw6uuy \
  -p \
  -P 3306 \
  bj7lnbakskgcgngpmtma \
  -e "SELECT tipo_usuario, COUNT(*) as total FROM usuarios GROUP BY tipo_usuario;"

EOF

# ============================================================================
# SECCIÓN 6: PRUEBA DE LOGIN
# ============================================================================

cat << 'EOF'
═══════════════════════════════════════════════════════════════
 6️⃣  PROBAR LOGIN CON CONTRASEÑA ACTUALIZADA
═══════════════════════════════════════════════════════════════

Después de actualizar una contraseña, prueba el login:

curl -X POST http://localhost:8000/public/login_process.php \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "usuario=2020068376&password=TestPassword123!"

# O visita en el navegador:
# http://localhost:8000/public/login.php

EOF

# ============================================================================
# SECCIÓN 7: USUARIOS DE PRUEBA DISPONIBLES
# ============================================================================

cat << 'EOF'
═══════════════════════════════════════════════════════════════
 7️⃣  USUARIOS DE PRUEBA DISPONIBLES
═══════════════════════════════════════════════════════════════

ESTUDIANTES:
----------------------------
Usuario: 2020068376
Email Personal: juan.perez@gmail.com
Nombre: Juan Pérez García
Password: password123

Usuario: 2020068377
Email Personal: maria.lopez@gmail.com
Nombre: María López Sánchez
Password: password123

Usuario: 2020068378
Email Personal: carlos.rodriguez@gmail.com
Nombre: Carlos Rodríguez Fernández
Password: password123

DOCENTES:
----------------------------
Usuario: prof001
Email Personal: maria.rodriguez@gmail.com
Nombre: María Rodríguez Gómez
Password: password123

Usuario: prof002
Email Personal: carlos.gomez@gmail.com
Nombre: Carlos Gómez López
Password: password123

ADMINISTRADORES:
----------------------------
Usuario: demo
Email Personal: demo@test.com
Nombre: Demo User
Password: demo123

Usuario: admin001
Email Personal: ana.martinez@gmail.com
Nombre: Ana Martínez Ruiz
Password: password123

EOF

# ============================================================================
# SECCIÓN 8: DEBUGGING Y LOGS
# ============================================================================

cat << 'EOF'
═══════════════════════════════════════════════════════════════
 8️⃣  DEBUGGING Y LOGS
═══════════════════════════════════════════════════════════════

Ver Logs de API Gateway:
----------------------------
tail -f /home/desci/Documentos/constru/upt-chat-system/services/api-gateway/logs/*.log

Ver Logs de NLP Service:
----------------------------
tail -f /home/desci/Documentos/constru/upt-chat-system/services/nlp-service/logs/*.log

Ver Errores de PHP:
----------------------------
tail -f /var/log/apache2/error.log
# O en terminal donde corre php -S:
# Los errores aparecen directamente en consola

Verificar Puertos en Uso:
----------------------------
lsof -i :8000  # ProyectoTest PHP
lsof -i :3000  # API Gateway
lsof -i :8001  # NLP Service
lsof -i :3005  # Notification Service

EOF

# ============================================================================
# SECCIÓN 9: SCRIPT DE PRUEBA AUTOMATIZADO
# ============================================================================

cat << 'EOF'
═══════════════════════════════════════════════════════════════
 9️⃣  SCRIPT DE PRUEBA AUTOMATIZADO
═══════════════════════════════════════════════════════════════

Ejecutar Script de Prueba Completo:
----------------------------
/home/desci/Documentos/constru/test_rf004_integration.sh

# Este script verifica:
# - Conectividad de servicios
# - API PHP funcionando
# - API Gateway integrado
# - Base de datos accesible
# - Usuarios de prueba disponibles

EOF

# ============================================================================
# SECCIÓN 10: POSTMAN COLLECTION (Importar)
# ============================================================================

cat << 'EOF'
═══════════════════════════════════════════════════════════════
 🔟  POSTMAN COLLECTION (Copia y pega en Postman)
═══════════════════════════════════════════════════════════════

{
  "info": {
    "name": "RF004 - Password Reset",
    "_postman_id": "12345",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "PHP API - Verify Email",
      "request": {
        "method": "POST",
        "header": [{"key":"Content-Type","value":"application/json"}],
        "body": {
          "mode": "raw",
          "raw": "{\"email_personal\":\"juan.perez@gmail.com\"}"
        },
        "url": {"raw":"http://localhost:8000/public/api_verify_email.php"}
      }
    },
    {
      "name": "PHP API - Update Password",
      "request": {
        "method": "POST",
        "header": [{"key":"Content-Type","value":"application/json"}],
        "body": {
          "mode": "raw",
          "raw": "{\"usuario\":\"2020068376\",\"new_password\":\"NewPass123!\"}"
        },
        "url": {"raw":"http://localhost:8000/public/api_update_password.php"}
      }
    },
    {
      "name": "API Gateway - Verify Email",
      "request": {
        "method": "POST",
        "header": [{"key":"Content-Type","value":"application/json"}],
        "body": {
          "mode": "raw",
          "raw": "{\"emailPersonal\":\"juan.perez@gmail.com\"}"
        },
        "url": {"raw":"http://localhost:3000/api/v1/password-reset/verify-email"}
      }
    },
    {
      "name": "API Gateway - Initiate Reset",
      "request": {
        "method": "POST",
        "header": [{"key":"Content-Type","value":"application/json"}],
        "body": {
          "mode": "raw",
          "raw": "{\"emailPersonal\":\"juan.perez@gmail.com\",\"sessionId\":\"test-001\"}"
        },
        "url": {"raw":"http://localhost:3000/api/v1/password-reset/initiate"}
      }
    },
    {
      "name": "API Gateway - Get Status",
      "request": {
        "method": "GET",
        "url": {"raw":"http://localhost:3000/api/v1/password-reset/status/test-001"}
      }
    }
  ]
}

EOF

# ============================================================================
# SECCIÓN 11: TROUBLESHOOTING
# ============================================================================

cat << 'EOF'
═══════════════════════════════════════════════════════════════
 🔧 TROUBLESHOOTING COMÚN
═══════════════════════════════════════════════════════════════

Problema: "Connection refused" en PHP
Solución:
----------------------------
# Verificar si PHP está corriendo
ps aux | grep php

# Iniciar servidor PHP
cd /home/desci/Documentos/constru/proyectotest
php -S localhost:8000

Problema: "Module not found" en API Gateway
Solución:
----------------------------
cd /home/desci/Documentos/constru/upt-chat-system/services/api-gateway
rm -rf node_modules package-lock.json
npm install
npm run start:dev

Problema: "Cannot connect to MySQL"
Solución:
----------------------------
# Verificar conectividad
telnet bj7lnbakskgcgngpmtma-mysql.services.clever-cloud.com 3306

# Verificar credenciales en:
# proyectotest/config/database.php

Problema: "Email not found" pero existe en BD
Solución:
----------------------------
# Verificar formato exacto del email
mysql -h bj7lnbakskgcgngpmtma-mysql.services.clever-cloud.com \
  -u u7imxhdxstbw6uuy -p bj7lnbakskgcgngpmtma \
  -e "SELECT email_personal FROM usuarios WHERE email_personal LIKE '%juan%';"

# Verificar espacios o caracteres extraños
# El email debe estar en lowercase y sin espacios

Problema: Puerto ya en uso
Solución:
----------------------------
# Matar proceso en puerto 8000
lsof -ti:8000 | xargs kill -9

# Matar proceso en puerto 3000
lsof -ti:3000 | xargs kill -9

EOF

# ============================================================================
# SECCIÓN 12: DOCUMENTACIÓN COMPLETA
# ============================================================================

cat << 'EOF'
═══════════════════════════════════════════════════════════════
 📚 DOCUMENTACIÓN COMPLETA
═══════════════════════════════════════════════════════════════

Guía de Integración Completa:
----------------------------
/home/desci/Documentos/constru/GUIA_INTEGRACION_RF004.md

Resumen de Implementación:
----------------------------
/home/desci/Documentos/constru/RESUMEN_IMPLEMENTACION_RF004.md

Documentación de Base de Datos:
----------------------------
/home/desci/Documentos/constru/proyectotest/RESUMEN_FINAL_BD.md

Arquitectura de Microservicios:
----------------------------
/home/desci/Documentos/constru/ARQUITECTURA_MICROSERVICIOS_RF004.md

EOF

# ============================================================================
# SECCIÓN 13: QUICK START
# ============================================================================

cat << 'EOF'
═══════════════════════════════════════════════════════════════
 🚀 QUICK START (Para comenzar rápido)
═══════════════════════════════════════════════════════════════

1. Iniciar ProyectoTest PHP (Terminal 1):
----------------------------
cd /home/desci/Documentos/constru/proyectotest && php -S localhost:8000

2. Probar PHP API:
----------------------------
curl -X POST http://localhost:8000/public/api_verify_email.php \
  -H "Content-Type: application/json" \
  -d '{"email_personal":"juan.perez@gmail.com"}' | jq

3. Iniciar API Gateway (Terminal 2):
----------------------------
cd /home/desci/Documentos/constru/upt-chat-system/services/api-gateway
npm run start:dev

4. Probar Integración:
----------------------------
curl -X POST http://localhost:3000/api/v1/password-reset/verify-email \
  -H "Content-Type: application/json" \
  -d '{"emailPersonal":"juan.perez@gmail.com"}' | jq

5. Ver Documentación:
----------------------------
cat /home/desci/Documentos/constru/RESUMEN_IMPLEMENTACION_RF004.md

EOF

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "  ✅ COMANDOS LISTOS PARA COPIAR Y PEGAR"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "Documentación completa:"
echo "  /home/desci/Documentos/constru/GUIA_INTEGRACION_RF004.md"
echo ""
echo "Script de prueba automatizado:"
echo "  /home/desci/Documentos/constru/test_rf004_integration.sh"
echo ""
