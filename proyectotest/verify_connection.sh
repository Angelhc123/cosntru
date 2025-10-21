#!/bin/bash

# Script para verificar conexión a Clever Cloud MySQL
# Proyecto Test - UPT Chat System

echo "🔍 VERIFICANDO CONEXIÓN A CLEVER CLOUD MYSQL"
echo "============================================"
echo ""

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Cargar variables de entorno
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
else
    echo -e "${RED}❌ Error: Archivo .env no encontrado${NC}"
    exit 1
fi

echo -e "${BLUE}📡 Configuración actual:${NC}"
echo "Host: $MYSQL_ADDON_HOST"
echo "Database: $MYSQL_ADDON_DB"
echo "User: $MYSQL_ADDON_USER"
echo "Port: $MYSQL_ADDON_PORT"
echo ""

# Verificar si mysql client está instalado
if ! command -v mysql &> /dev/null; then
    echo -e "${RED}❌ MySQL client no está instalado${NC}"
    echo "Instala con: sudo apt-get install mysql-client"
    exit 1
fi

echo -e "${YELLOW}🔄 Intentando conectar...${NC}"
echo ""

# Intentar conexión y obtener información
RESULT=$(mysql -h "$MYSQL_ADDON_HOST" \
              -P "$MYSQL_ADDON_PORT" \
              -u "$MYSQL_ADDON_USER" \
              -p"$MYSQL_ADDON_PASSWORD" \
              "$MYSQL_ADDON_DB" \
              -e "SELECT VERSION() as version, DATABASE() as db_name, USER() as user;" 2>&1)

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ CONEXIÓN EXITOSA${NC}"
    echo ""
    echo "$RESULT"
    echo ""
    
    # Verificar si la tabla usuarios existe
    TABLE_EXISTS=$(mysql -h "$MYSQL_ADDON_HOST" \
                         -P "$MYSQL_ADDON_PORT" \
                         -u "$MYSQL_ADDON_USER" \
                         -p"$MYSQL_ADDON_PASSWORD" \
                         "$MYSQL_ADDON_DB" \
                         -sN -e "SHOW TABLES LIKE 'usuarios';" 2>&1)
    
    if [ -n "$TABLE_EXISTS" ]; then
        echo -e "${GREEN}✅ Tabla 'usuarios' existe${NC}"
        
        # Contar usuarios
        USER_COUNT=$(mysql -h "$MYSQL_ADDON_HOST" \
                           -P "$MYSQL_ADDON_PORT" \
                           -u "$MYSQL_ADDON_USER" \
                           -p"$MYSQL_ADDON_PASSWORD" \
                           "$MYSQL_ADDON_DB" \
                           -sN -e "SELECT COUNT(*) FROM usuarios;" 2>&1)
        
        echo "Total de usuarios: $USER_COUNT"
        
        # Verificar si existe campo email_personal
        EMAIL_PERSONAL_EXISTS=$(mysql -h "$MYSQL_ADDON_HOST" \
                                      -P "$MYSQL_ADDON_PORT" \
                                      -u "$MYSQL_ADDON_USER" \
                                      -p"$MYSQL_ADDON_PASSWORD" \
                                      "$MYSQL_ADDON_DB" \
                                      -sN -e "SHOW COLUMNS FROM usuarios LIKE 'email_personal';" 2>&1)
        
        if [ -n "$EMAIL_PERSONAL_EXISTS" ]; then
            echo -e "${GREEN}✅ Campo 'email_personal' existe${NC}"
        else
            echo -e "${YELLOW}⚠️  Campo 'email_personal' NO existe (necesita actualización)${NC}"
        fi
        
    else
        echo -e "${YELLOW}⚠️  Tabla 'usuarios' NO existe (se creará al aplicar cambios)${NC}"
    fi
    
    echo ""
    echo -e "${GREEN}✅ TODO LISTO PARA APLICAR CAMBIOS${NC}"
    echo ""
    echo "Ejecuta: ./apply_database_changes.sh"
    
else
    echo -e "${RED}❌ ERROR DE CONEXIÓN${NC}"
    echo ""
    echo "Detalles del error:"
    echo "$RESULT"
    echo ""
    echo "Verifica:"
    echo "1. Que las credenciales en .env sean correctas"
    echo "2. Que tu IP esté permitida en Clever Cloud"
    echo "3. Que tengas conexión a Internet"
    exit 1
fi
