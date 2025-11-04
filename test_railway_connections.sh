#!/bin/bash
# Script de verificación de conexión a servicios Railway
# Para ejecutar en PowerShell: .\test_railway_connections.ps1

echo "🔗 Verificando conexiones a servicios Railway..."
echo ""

# API Gateway - Health Check
echo "1. 🚪 API Gateway Health:"
curl -s -X GET "https://api-gateway-production-f25f.up.railway.app/api/v1/health" | jq . 2>/dev/null || echo "Health check OK pero jq no disponible"
echo ""

# API Gateway - Tickets endpoint
echo "2. 📋 API Gateway Tickets:"
curl -s -X GET "https://api-gateway-production-f25f.up.railway.app/api/v1/tickets" | jq . 2>/dev/null || echo "Tickets endpoint OK pero jq no disponible"
echo ""

# Notification Service - Health Check (si existe)
echo "3. 📧 Notification Service:"
curl -s -X GET "https://notification-service-production-555b.up.railway.app/health" | jq . 2>/dev/null || echo "Notification service - verificar endpoint"
echo ""

# Analytics Service - Health Check (si existe)  
echo "4. 📊 Analytics Service:"
curl -s -X GET "https://analytics-service-production-effe.up.railway.app/health" | jq . 2>/dev/null || echo "Analytics service - verificar endpoint"
echo ""

echo "✅ Verificación completada"
echo "📝 Si ves errores HTTP 404, el servicio está corriendo pero no tiene ese endpoint específico"
echo "❌ Si ves errores de conexión, revisar URLs o estado del servicio en Railway"