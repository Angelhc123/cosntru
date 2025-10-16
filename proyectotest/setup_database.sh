#!/bin/bash

# Script para configurar la base de datos en Clever Cloud
# Uso: ./setup_database.sh

echo "=============================================="
echo "  CONFIGURACIÓN DE BASE DE DATOS MYSQL"
echo "  Clever Cloud"
echo "=============================================="
echo ""

# Cargar variables de entorno
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
    echo "✅ Variables de entorno cargadas desde .env"
else
    echo "❌ No se encontró el archivo .env"
    echo "💡 Copia .env.example a .env y configura tus credenciales"
    exit 1
fi

echo ""
echo "📡 Conectando a la base de datos..."
echo "   Host: $MYSQL_ADDON_HOST"
echo "   Database: $MYSQL_ADDON_DB"
echo "   User: $MYSQL_ADDON_USER"
echo ""

# Verificar si mysql está instalado
if ! command -v mysql &> /dev/null; then
    echo "❌ MySQL client no está instalado"
    echo "💡 Instala con: sudo apt install mysql-client"
    exit 1
fi

# Probar conexión
echo "🔍 Probando conexión..."
mysql -h "$MYSQL_ADDON_HOST" \
      -P "$MYSQL_ADDON_PORT" \
      -u "$MYSQL_ADDON_USER" \
      -p"$MYSQL_ADDON_PASSWORD" \
      -e "SELECT 'Conexión exitosa' as status;" \
      "$MYSQL_ADDON_DB"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Conexión exitosa!"
    echo ""
    
    # Preguntar si desea ejecutar el script SQL
    read -p "¿Deseas ejecutar el script database_setup.sql? (s/n): " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[Ss]$ ]]; then
        if [ -f database_setup.sql ]; then
            echo "📥 Ejecutando script SQL..."
            mysql -h "$MYSQL_ADDON_HOST" \
                  -P "$MYSQL_ADDON_PORT" \
                  -u "$MYSQL_ADDON_USER" \
                  -p"$MYSQL_ADDON_PASSWORD" \
                  "$MYSQL_ADDON_DB" < database_setup.sql
            
            if [ $? -eq 0 ]; then
                echo "✅ Script ejecutado exitosamente"
            else
                echo "❌ Error al ejecutar el script"
                exit 1
            fi
        else
            echo "❌ No se encontró database_setup.sql"
            exit 1
        fi
    fi
    
    echo ""
    echo "🔍 Mostrando tablas existentes..."
    mysql -h "$MYSQL_ADDON_HOST" \
          -P "$MYSQL_ADDON_PORT" \
          -u "$MYSQL_ADDON_USER" \
          -p"$MYSQL_ADDON_PASSWORD" \
          -e "SHOW TABLES;" \
          "$MYSQL_ADDON_DB"
    
    echo ""
    echo "✨ ¡Configuración completada!"
    echo "💡 Ejecuta: php test_connection.php para verificar desde PHP"
    
else
    echo ""
    echo "❌ Error de conexión"
    echo "💡 Verifica las credenciales en el archivo .env"
    exit 1
fi

echo ""
echo "=============================================="
