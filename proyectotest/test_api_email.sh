#!/bin/bash

# Script para probar los nuevos endpoints de API
# Proyecto Test - UPT Chat System

echo "🧪 PRUEBAS DE API - Email Personal (RF004)"
echo "=========================================="
echo ""

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

API_URL="http://localhost:8000/public"

# Función para hacer requests
test_endpoint() {
    local endpoint=$1
    local data=$2
    local test_name=$3
    
    echo -e "${YELLOW}Probando:${NC} $test_name"
    echo "Endpoint: $API_URL$endpoint"
    echo "Data: $data"
    echo ""
    
    response=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST "$API_URL$endpoint" \
        -H "Content-Type: application/json" \
        -d "$data")
    
    http_code=$(echo "$response" | grep "HTTP_CODE:" | cut -d: -f2)
    body=$(echo "$response" | sed '/HTTP_CODE:/d')
    
    echo "Response Code: $http_code"
    echo "$body" | jq '.' 2>/dev/null || echo "$body"
    echo ""
    
    if [ "$http_code" = "200" ]; then
        echo -e "${GREEN}✅ PASSED${NC}"
    else
        echo -e "${RED}❌ FAILED${NC}"
    fi
    echo "----------------------------------------"
    echo ""
}

# Verificar si jq está instalado
if ! command -v jq &> /dev/null; then
    echo -e "${YELLOW}⚠️  Advertencia: 'jq' no está instalado. Las respuestas JSON no se formatearán.${NC}"
    echo "Para instalar: sudo apt-get install jq"
    echo ""
fi

# Verificar si el servidor está corriendo
echo "🔍 Verificando servidor PHP..."
if curl -s -o /dev/null -w "%{http_code}" "http://localhost:8000" | grep -q "200\|302"; then
    echo -e "${GREEN}✅ Servidor PHP está corriendo en puerto 8000${NC}"
else
    echo -e "${RED}❌ Servidor PHP no está corriendo${NC}"
    echo "Inicia el servidor con: php -S localhost:8000 -t public/"
    exit 1
fi
echo ""

# TEST 1: Verificar email que existe
test_endpoint "/api_verify_email.php" \
    '{"email_personal": "juanperez@gmail.com"}' \
    "TEST 1: Verificar email existente"

# TEST 2: Verificar email que NO existe
test_endpoint "/api_verify_email.php" \
    '{"email_personal": "noexiste@gmail.com"}' \
    "TEST 2: Verificar email inexistente"

# TEST 3: Verificar email con formato inválido
test_endpoint "/api_verify_email.php" \
    '{"email_personal": "emailinvalido"}' \
    "TEST 3: Verificar email con formato inválido"

# TEST 4: Request sin email_personal
test_endpoint "/api_verify_email.php" \
    '{}' \
    "TEST 4: Request sin campo email_personal"

# TEST 5: Actualizar contraseña de usuario válido
test_endpoint "/api_update_password.php" \
    '{"usuario": "2020068376", "new_password": "nuevaPassword123"}' \
    "TEST 5: Actualizar contraseña de usuario válido"

# TEST 6: Actualizar contraseña de usuario inexistente
test_endpoint "/api_update_password.php" \
    '{"usuario": "999999999", "new_password": "password123"}' \
    "TEST 6: Actualizar contraseña de usuario inexistente"

# TEST 7: Actualizar contraseña muy corta
test_endpoint "/api_update_password.php" \
    '{"usuario": "2020068376", "new_password": "123"}' \
    "TEST 7: Actualizar contraseña muy corta (< 6 caracteres)"

# TEST 8: Request sin campos requeridos
test_endpoint "/api_update_password.php" \
    '{"usuario": "2020068376"}' \
    "TEST 8: Request sin campo new_password"

echo ""
echo "=========================================="
echo -e "${GREEN}✅ PRUEBAS COMPLETADAS${NC}"
echo "=========================================="
echo ""

# Prueba de login (opcional)
echo "🔐 Prueba adicional: Login con nueva contraseña"
echo "Usuario: 2020068376"
echo "Contraseña actualizada: nuevaPassword123"
echo ""
echo "Puedes probar el login accediendo a:"
echo "http://localhost:8000/login.php"
echo ""
