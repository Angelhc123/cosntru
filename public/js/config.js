/**
 * Configuración de URLs para servicios Railway
 * Archivo centralizado para todas las conexiones API
 */

const API_CONFIG = {
    // URLs de producción en Railway (URLs exactas verificadas)
    API_GATEWAY: 'https://api-gateway-production-f25f.up.railway.app/api/v1',
    NOTIFICATION_SERVICE: 'https://notification-service-production-555b.up.railway.app/api/notifications',
    ANALYTICS_SERVICE: 'https://analytics-service-production-effe.up.railway.app/api/v1/analytics',
    NLP_SERVICE: 'https://nlp-service-production-3f94.up.railway.app',
    DB_SEEDER: 'https://db-seeder-production.up.railway.app',
    
    // URLs de desarrollo (comentadas)
    // API_GATEWAY: 'http://localhost:3000/api/v1',
    // NOTIFICATION_SERVICE: 'http://localhost:3005/api/notifications',
    // ANALYTICS_SERVICE: 'http://localhost:3006/api/analytics',
    // NLP_SERVICE: 'http://localhost:3003/api/nlp',
};

// Para compatibilidad con código existente
const API_BASE_URL = API_CONFIG.API_GATEWAY;

// Función para obtener URL de servicio
function getServiceUrl(serviceName) {
    return API_CONFIG[serviceName.toUpperCase()] || API_CONFIG.API_GATEWAY;
}

// Log de configuración
console.log('🔗 API Config cargada:', {
    environment: 'production',
    apiGateway: API_CONFIG.API_GATEWAY,
    notificationService: API_CONFIG.NOTIFICATION_SERVICE
});