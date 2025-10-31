#!/bin/bash

# Script para aplicar cambios de base de datos a Clever Cloud MySQL
# Proyecto Test - UPT Chat System

echo "🗄️  APLICANDO CAMBIOS A BASE DE DATOS CLEVER CLOUD"
echo "=================================================="
echo ""

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Cargar variables de entorno
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
    echo -e "${GREEN}✅ Variables de entorno cargadas${NC}"
else
    echo -e "${RED}❌ Error: Archivo .env no encontrado${NC}"
    exit 1
fi

# Mostrar información de conexión
echo ""
echo -e "${BLUE}📡 Información de Conexión:${NC}"
echo "Host: $MYSQL_ADDON_HOST"
echo "Database: $MYSQL_ADDON_DB"
echo "User: $MYSQL_ADDON_USER"
echo "Port: $MYSQL_ADDON_PORT"
echo ""

# Confirmar antes de proceder
echo -e "${YELLOW}⚠️  ADVERTENCIA:${NC}"
echo "Este script va a:"
echo "1. Crear/modificar la tabla 'usuarios' con nuevos campos"
echo "2. Insertar 18 usuarios de prueba"
echo "3. Los datos existentes NO se eliminarán (ON DUPLICATE KEY UPDATE)"
echo ""
read -p "¿Deseas continuar? (s/n): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Ss]$ ]]; then
    echo -e "${YELLOW}Operación cancelada${NC}"
    exit 0
fi

echo ""
echo -e "${BLUE}🚀 Aplicando cambios...${NC}"
echo ""

# Ejecutar script SQL
mysql -h "$MYSQL_ADDON_HOST" \
      -P "$MYSQL_ADDON_PORT" \
      -u "$MYSQL_ADDON_USER" \
      -p"$MYSQL_ADDON_PASSWORD" \
      "$MYSQL_ADDON_DB" < database_setup.sql

# Verificar resultado
if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ ¡Cambios aplicados exitosamente!${NC}"
    echo ""
    echo -e "${BLUE}📊 Verificando datos insertados...${NC}"
    
    # Contar usuarios
    USER_COUNT=$(mysql -h "$MYSQL_ADDON_HOST" \
                       -P "$MYSQL_ADDON_PORT" \
                       -u "$MYSQL_ADDON_USER" \
                       -p"$MYSQL_ADDON_PASSWORD" \
                       "$MYSQL_ADDON_DB" \
                       -sN -e "SELECT COUNT(*) FROM usuarios;")
    
    echo "Total de usuarios en la base de datos: $USER_COUNT"
    
    # Mostrar algunos usuarios de ejemplo
    echo ""
    echo -e "${BLUE}👥 Usuarios de prueba insertados:${NC}"
    mysql -h "$MYSQL_ADDON_HOST" \
          -P "$MYSQL_ADDON_PORT" \
          -u "$MYSQL_ADDON_USER" \
          -p"$MYSQL_ADDON_PASSWORD" \
          "$MYSQL_ADDON_DB" \
          -e "SELECT usuario, nombre_completo, email, email_personal, tipo_usuario FROM usuarios LIMIT 5;"
    
    echo ""
    echo -e "${GREEN}✅ PROCESO COMPLETADO${NC}"
    echo ""
    echo -e "${BLUE}📝 Credenciales de acceso:${NC}"
    echo "URL: http://localhost:8000/login.php"
    echo "Usuario: 2020068376 (o cualquier otro de prueba)"
    echo "Contraseña: password123"
    echo ""
    echo -e "${BLUE}🔗 Endpoints API disponibles:${NC}"
    echo "POST http://localhost:8000/public/api_verify_email.php"
    echo "POST http://localhost:8000/public/api_update_password.php"
    echo ""
else
    echo ""
    echo -e "${RED}❌ Error al aplicar cambios${NC}"
    echo "Revisa los mensajes de error arriba"
    exit 1
fi
