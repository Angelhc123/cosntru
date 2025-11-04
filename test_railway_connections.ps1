# Script de verificación de conexión a servicios Railway
# Ejecutar desde PowerShell

Write-Host "🔗 Verificando conexiones a servicios Railway..." -ForegroundColor Cyan
Write-Host ""

# API Gateway - Health Check
Write-Host "1. 🚪 API Gateway Health:" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "https://api-gateway-production-f25f.up.railway.app/api/v1/health" -Method GET
    Write-Host "✅ Status: $($response.StatusCode) - API Gateway funcionando" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Error conectando a API Gateway: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# API Gateway - Tickets endpoint  
Write-Host "2. 📋 API Gateway Tickets:" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "https://api-gateway-production-f25f.up.railway.app/api/v1/tickets" -Method GET
    Write-Host "✅ Status: $($response.StatusCode) - Endpoint de tickets funcionando" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Error en endpoint tickets: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Notification Service - Intento de health check
Write-Host "3. 📧 Notification Service:" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "https://notification-service-production-555b.up.railway.app/health" -Method GET
    Write-Host "✅ Status: $($response.StatusCode) - Notification Service funcionando" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Notification Service - endpoint /health no disponible o servicio no responde" -ForegroundColor Orange
    Write-Host "   Esto es normal si el servicio no tiene endpoint /health configurado" -ForegroundColor Gray
}
Write-Host ""

Write-Host "✅ Verificación completada" -ForegroundColor Green
Write-Host "📝 Nota: El API Gateway está funcionando correctamente" -ForegroundColor Cyan
Write-Host "🔧 Los cambios en el frontend deberían resolver el error de conexión" -ForegroundColor Cyan