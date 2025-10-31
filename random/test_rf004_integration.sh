#!/bin/bash

# 🧪 Script de Prueba RF004 - Password Reset Integration
# Prueba la integración completa entre API Gateway y ProyectoTest

echo "╔════════════════════════════════════════════════════════════╗"
echo "║        🔐 PRUEBA DE INTEGRACIÓN RF004                      ║"
echo "║     Recuperación de Contraseña por Email Personal          ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# URLs de los servicios
PHP_API="http://localhost:8000/public"
API_GATEWAY="http://localhost:3000/api/v1/password-reset"

# Función para imprimir secciones
print_section() {
    echo ""
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}   $1${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
    echo ""
}

# Función para verificar si un servicio está corriendo
check_service() {
    local url=$1
    local name=$2
    
    if curl -s -f -o /dev/null "$url"; then
        echo -e "${GREEN}✓${NC} $name está corriendo"
        return 0
    else
        echo -e "${RED}✗${NC} $name NO está corriendo"
        return 1
    fi
}

# Test 1: Verificar servicios activos
print_section "1️⃣  VERIFICANDO SERVICIOS"

check_service "$PHP_API/api_verify_email.php" "ProyectoTest PHP (puerto 8000)"
php_running=$?

check_service "$API_GATEWAY/status/test" "API Gateway (puerto 3000)"
gateway_running=$?

if [ $php_running -ne 0 ] || [ $gateway_running -ne 0 ]; then
    echo ""
    echo -e "${YELLOW}⚠️  Algunos servicios no están corriendo. Iniciándolos...${NC}"
    echo ""
    echo "Ejecuta estos comandos en terminales separadas:"
    echo ""
    echo "Terminal 1 - ProyectoTest PHP:"
    echo "  cd /home/desci/Documentos/constru/proyectotest"
    echo "  php -S localhost:8000"
    echo ""
    echo "Terminal 2 - API Gateway:"
    echo "  cd /home/desci/Documentos/constru/upt-chat-system/services/api-gateway"
    echo "  npm run start:dev"
    echo ""
    exit 1
fi

# Test 2: Verificar email existente (PHP directo)
print_section "2️⃣  TEST PHP API - VERIFICAR EMAIL EXISTENTE"

echo -e "${YELLOW}Probando:${NC} juan.perez@gmail.com"
echo ""

response=$(curl -s -X POST "$PHP_API/api_verify_email.php" \
  -H "Content-Type: application/json" \
  -d '{"email_personal":"juan.perez@gmail.com"}')

echo "Response:"
echo "$response" | jq '.'

if echo "$response" | jq -e '.success == true' > /dev/null; then
    echo ""
    echo -e "${GREEN}✓ ÉXITO:${NC} Email encontrado"
    usuario=$(echo "$response" | jq -r '.data.usuario')
    nombre=$(echo "$response" | jq -r '.data.nombre_completo')
    echo "  Usuario: $usuario"
    echo "  Nombre: $nombre"
else
    echo -e "${RED}✗ FALLO:${NC} Email no encontrado"
fi

# Test 3: Verificar email NO existente (PHP directo)
print_section "3️⃣  TEST PHP API - EMAIL NO EXISTENTE"

echo -e "${YELLOW}Probando:${NC} noexiste@gmail.com"
echo ""

response=$(curl -s -X POST "$PHP_API/api_verify_email.php" \
  -H "Content-Type: application/json" \
  -d '{"email_personal":"noexiste@gmail.com"}')

echo "Response:"
echo "$response" | jq '.'

if echo "$response" | jq -e '.success == false' > /dev/null; then
    echo ""
    echo -e "${GREEN}✓ ÉXITO:${NC} Email correctamente reportado como no existente"
else
    echo -e "${RED}✗ FALLO:${NC} Respuesta inesperada"
fi

# Test 4: API Gateway - Verificar email
print_section "4️⃣  TEST API GATEWAY - VERIFY EMAIL"

echo -e "${YELLOW}Probando:${NC} juan.perez@gmail.com (via API Gateway)"
echo ""

response=$(curl -s -X POST "$API_GATEWAY/verify-email" \
  -H "Content-Type: application/json" \
  -d '{"emailPersonal":"juan.perez@gmail.com"}')

echo "Response:"
echo "$response" | jq '.'

if echo "$response" | jq -e '.exists == true' > /dev/null; then
    echo ""
    echo -e "${GREEN}✓ ÉXITO:${NC} API Gateway correctamente conectado con PHP API"
else
    echo -e "${RED}✗ FALLO:${NC} Problema en integración API Gateway <-> PHP"
fi

# Test 5: Listar usuarios de prueba disponibles
print_section "5️⃣  USUARIOS DE PRUEBA DISPONIBLES"

echo "Puedes usar cualquiera de estos emails personales:"
echo ""
echo -e "${GREEN}ESTUDIANTES:${NC}"
echo "  juan.perez@gmail.com          (Usuario: 2020068376)"
echo "  maria.lopez@gmail.com         (Usuario: 2020068377)"
echo "  carlos.rodriguez@gmail.com    (Usuario: 2020068378)"
echo ""
echo -e "${BLUE}DOCENTES:${NC}"
echo "  maria.rodriguez@gmail.com     (Usuario: prof001)"
echo "  carlos.gomez@gmail.com        (Usuario: prof002)"
echo ""
echo -e "${YELLOW}ADMINISTRATIVOS:${NC}"
echo "  ana.martinez@gmail.com        (Usuario: admin001)"
echo ""

# Test 6: Probar actualización de contraseña (sin ejecutar)
print_section "6️⃣  TEST ACTUALIZACIÓN DE CONTRASEÑA"

echo -e "${YELLOW}Este test NO modificará la base de datos (solo muestra el comando)${NC}"
echo ""
echo "Para probar actualización de contraseña, ejecuta:"
echo ""
echo "curl -X POST $PHP_API/api_update_password.php \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{\"usuario\":\"2020068376\",\"new_password\":\"TestPassword123!\"}'"
echo ""

# Test 7: Verificar estructura de BD
print_section "7️⃣  VERIFICAR ESTRUCTURA DE BASE DE DATOS"

echo "Conectando a Clever Cloud MySQL..."
echo ""

# Comando para verificar BD (usuario puede ejecutarlo manualmente)
echo "Ejecuta este comando para verificar la BD:"
echo ""
echo "mysql -h bj7lnbakskgcgngpmtma-mysql.services.clever-cloud.com \\"
echo "  -u u7imxhdxstbw6uuy \\"
echo "  -p \\"
echo "  -P 3306 \\"
echo "  bj7lnbakskgcgngpmtma \\"
echo "  -e \"SELECT usuario, email_personal, nombre_completo FROM usuarios LIMIT 5;\""
echo ""

# Resumen Final
print_section "📊 RESUMEN DE PRUEBAS"

echo "Estado de Servicios:"
if [ $php_running -eq 0 ]; then
    echo -e "  ${GREEN}✓${NC} ProyectoTest PHP"
else
    echo -e "  ${RED}✗${NC} ProyectoTest PHP"
fi

if [ $gateway_running -eq 0 ]; then
    echo -e "  ${GREEN}✓${NC} API Gateway"
else
    echo -e "  ${RED}✗${NC} API Gateway"
fi

echo ""
echo "Próximos pasos:"
echo "  1. Implementar integración con NLP Service"
echo "  2. Configurar Notification Service para envío de emails"
echo "  3. Probar flujo completo end-to-end"
echo ""
echo -e "${BLUE}Documentación completa:${NC} /home/desci/Documentos/constru/GUIA_INTEGRACION_RF004.md"
echo ""

print_section "✨ PRUEBA COMPLETADA"
