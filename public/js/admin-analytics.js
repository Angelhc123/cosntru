/**
 * Dashboard de Analytics - Frontend
 * Conecta con Analytics Service en puerto 3006
 */

const ANALYTICS_API_URL = 'https://analytics-service-production-effe.up.railway.app/api/v1/analytics';
const REQUEST_TIMEOUT = 45000; // 45 segundos - Railway puede tardar en despertar

let chartsInstances = {};
let currentDates = {
    start: null,
    end: null
};

/**
 * Fetch con timeout y reintentos
 */
async function fetchWithTimeout(url, timeout = REQUEST_TIMEOUT, retries = 2) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            console.log(`🔄 Intento ${attempt}/${retries} - Fetching: ${url}`);
            
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeout);
            
            const response = await fetch(url, { 
                signal: controller.signal,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error(`❌ HTTP ${response.status}:`, errorText);
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }
            
            const data = await response.json();
            console.log(`✅ Success:`, data.success);
            return data;
            
        } catch (error) {
            if (attempt === retries) {
                console.error(`❌ Falló después de ${retries} intentos:`, error);
                throw error;
            }
            
            if (error.name === 'AbortError') {
                console.warn(`⏱️ Timeout en intento ${attempt}, reintentando...`);
            } else {
                console.warn(`⚠️ Error en intento ${attempt}:`, error.message);
            }
            
            // Esperar 2 segundos antes de reintentar
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
}

/**
 * Inicializar dashboard al cargar la página
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('📊 Inicializando Dashboard de Analytics...');
    
    // Configurar selector de período personalizado
    document.getElementById('period-select').addEventListener('change', function() {
        const value = this.value;
        const startDate = document.getElementById('start-date');
        const endDate = document.getElementById('end-date');
        
        if (value === 'custom') {
            startDate.style.display = 'inline-block';
            endDate.style.display = 'inline-block';
            
            // Establecer valores por defecto
            const today = new Date();
            const thirtyDaysAgo = new Date(today);
            thirtyDaysAgo.setDate(today.getDate() - 30);
            
            endDate.value = today.toISOString().split('T')[0];
            startDate.value = thirtyDaysAgo.toISOString().split('T')[0];
        } else {
            startDate.style.display = 'none';
            endDate.style.display = 'none';
        }
    });
    
    // Cargar dashboard por primera vez
    updateDashboard();
});

/**
 * Actualizar todo el dashboard
 */
async function updateDashboard() {
    console.log('🔄 Actualizando dashboard...');
    console.log('⚠️ Nota: Railway puede tardar ~30 segundos si el servicio estaba inactivo');
    
    // Calcular fechas según el período seleccionado
    const period = document.getElementById('period-select').value;
    const endDate = new Date();
    let startDate = new Date();
    
    if (period === 'custom') {
        startDate = new Date(document.getElementById('start-date').value);
        endDate.setTime(new Date(document.getElementById('end-date').value).getTime());
    } else {
        startDate.setDate(endDate.getDate() - parseInt(period));
    }
    
    currentDates.start = startDate;
    currentDates.end = endDate;
    
    // Mostrar loading con mensaje más informativo
    const loadingEl = document.getElementById('loading');
    loadingEl.innerHTML = `
        <div style="text-align: center; padding: 40px;">
            <div style="font-size: 48px; margin-bottom: 20px; animation: spin 2s linear infinite;">⏳</div>
            <h3>Cargando datos desde Analytics Service...</h3>
            <p style="color: #666; margin-top: 15px;">
                Si el servicio estaba inactivo en Railway, puede tardar hasta 45 segundos en despertar.<br>
                Por favor espera...
            </p>
            <div style="margin-top: 20px; color: #999; font-size: 14px;">
                <div id="loading-progress">Conectando al servicio...</div>
            </div>
        </div>
        <style>
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        </style>
    `;
    loadingEl.style.display = 'block';
    document.getElementById('content').style.display = 'none';
    
    try {
        // Verificar health primero
        document.getElementById('loading-progress').textContent = 'Verificando estado del servicio...';
        
        try {
            await fetchWithTimeout(`${ANALYTICS_API_URL}/health`, 15000, 1);
            document.getElementById('loading-progress').textContent = '✅ Servicio activo. Cargando datos...';
        } catch {
            document.getElementById('loading-progress').textContent = '⚠️ Despertando servicio en Railway (esto puede tardar ~30s)...';
        }
        
        // Cargar todos los datos
        await Promise.all([
            loadDashboardStats(),
            loadQueriesChart(),
            loadFeedbackChart(),
            loadIntentsChart(),
            loadFaqsChart(),
            loadTicketsChart(),
            loadUsagePatterns(),
            loadLowConfidenceChart(),
            loadEscalationReasonsChart()
        ]);
        
        // Ocultar loading y mostrar contenido
        document.getElementById('loading').style.display = 'none';
        document.getElementById('content').style.display = 'block';
        
        console.log('✅ Dashboard actualizado correctamente');
    } catch (error) {
        console.error('❌ Error al actualizar dashboard:', error);
        
        loadingEl.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #dc3545;">
                <div style="font-size: 64px; margin-bottom: 20px;">⚠️</div>
                <h3>Error al cargar datos del Analytics Service</h3>
                <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px auto; max-width: 700px; text-align: left;">
                    <strong>🔍 Detalles del error:</strong><br>
                    <code style="display: block; margin-top: 10px; padding: 10px; background: white; border-radius: 5px; color: #dc3545;">
                        ${error.message || error}
                    </code>
                    <br>
                    <strong>🌐 URL del servicio:</strong><br>
                    <code style="display: block; margin-top: 5px; padding: 10px; background: white; border-radius: 5px;">
                        ${ANALYTICS_API_URL}
                    </code>
                    <br>
                    <strong>💡 Posibles causas:</strong>
                    <ul style="margin-top: 10px; text-align: left; color: #666;">
                        <li>El servicio Analytics no está desplegado en Railway</li>
                        <li>El servicio está en cold start y necesita más tiempo</li>
                        <li>La base de datos MongoDB no está conectada</li>
                        <li>Problemas de CORS en el servicio</li>
                        <li>La URL del servicio cambió en Railway</li>
                    </ul>
                </div>
                <div style="margin-top: 20px;">
                    <button onclick="updateDashboard()" style="
                        background: #667eea; 
                        color: white; 
                        border: none; 
                        padding: 12px 24px; 
                        border-radius: 5px; 
                        cursor: pointer;
                        font-size: 16px;
                        font-weight: 600;
                        margin-right: 10px;
                    ">
                        🔄 Reintentar Carga
                    </button>
                    <a href="/admin" style="
                        display: inline-block;
                        padding: 12px 24px;
                        background: #6c757d;
                        color: white;
                        text-decoration: none;
                        border-radius: 5px;
                        font-weight: 600;
                    ">
                        ← Volver al Panel
                    </a>
                </div>
            </div>
        `;
    }
}

/**
 * Cargar estadísticas generales
 */
async function loadDashboardStats() {
    const params = new URLSearchParams({
        startDate: currentDates.start.toISOString(),
        endDate: currentDates.end.toISOString()
    });
    
    const data = await fetchWithTimeout(`${ANALYTICS_API_URL}/dashboard?${params}`);
    
    if (!data.success) {
        throw new Error('Error al cargar estadísticas generales');
    }
    
    const stats = data.data;
    
    // Renderizar tarjetas de estadísticas
    const statsGrid = document.getElementById('stats-grid');
    statsGrid.innerHTML = `
        <div class="stat-card">
            <div class="icon">💬</div>
            <div class="value">${stats.totalQueries.toLocaleString()}</div>
            <div class="label">Consultas Totales</div>
        </div>
        
        <div class="stat-card">
            <div class="icon">🎯</div>
            <div class="value">${stats.averageConfidence.toFixed(1)}%</div>
            <div class="label">Confianza Promedio</div>
        </div>
        
        <div class="stat-card">
            <div class="icon">👍</div>
            <div class="value">${stats.positiveRate.toFixed(1)}%</div>
            <div class="label">Feedback Positivo</div>
        </div>
        
        <div class="stat-card">
            <div class="icon">🎫</div>
            <div class="value">${stats.escalationRate.toFixed(1)}%</div>
            <div class="label">Tasa de Escalación</div>
        </div>
    `;
}

/**
 * Cargar gráfico de consultas por día
 */
async function loadQueriesChart() {
    const params = new URLSearchParams({
        startDate: currentDates.start.toISOString(),
        endDate: currentDates.end.toISOString(),
        granularity: 'day'
    });
    
    const data = await fetchWithTimeout(`${ANALYTICS_API_URL}/queries?${params}`);
    
    if (!data.success) {
        throw new Error('Error al cargar consultas');
    }
    
    const queries = data.data;
    
    // Destruir chart anterior si existe
    if (chartsInstances['queries']) {
        chartsInstances['queries'].destroy();
    }
    
    const ctx = document.getElementById('queries-chart').getContext('2d');
    chartsInstances['queries'] = new Chart(ctx, {
        type: 'line',
        data: {
            labels: queries.map(q => q.period),
            datasets: [{
                label: 'Consultas',
                data: queries.map(q => q.count),
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

/**
 * Cargar gráfico de feedback
 */
async function loadFeedbackChart() {
    const params = new URLSearchParams({
        startDate: currentDates.start.toISOString(),
        endDate: currentDates.end.toISOString()
    });
    
    const data = await fetchWithTimeout(`${ANALYTICS_API_URL}/feedback?${params}`);
    
    if (!data.success) {
        throw new Error('Error al cargar feedback');
    }
    
    const feedback = data.data;
    
    if (chartsInstances['feedback']) {
        chartsInstances['feedback'].destroy();
    }
    
    const ctx = document.getElementById('feedback-chart').getContext('2d');
    chartsInstances['feedback'] = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: feedback.map(f => f.type === 'positive' ? '👍 Positivo' : '👎 Negativo'),
            datasets: [{
                data: feedback.map(f => f.count),
                backgroundColor: ['#28a745', '#dc3545']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
}

/**
 * Cargar gráfico de top intents
 */
async function loadIntentsChart() {
    const params = new URLSearchParams({
        startDate: currentDates.start.toISOString(),
        endDate: currentDates.end.toISOString(),
        limit: '10'
    });
    
    const data = await fetchWithTimeout(`${ANALYTICS_API_URL}/intents/top?${params}`);
    
    if (!data.success) {
        throw new Error('Error al cargar intents');
    }
    
    const intents = data.data || [];
    
    if (chartsInstances['intents']) {
        chartsInstances['intents'].destroy();
    }
    
    const ctx = document.getElementById('intents-chart').getContext('2d');
    chartsInstances['intents'] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: intents.map(i => {
                // Si name es un objeto, extraer el id o name
                if (typeof i.name === 'object' && i.name !== null) {
                    return i.name.id || i.name.name || 'Sin intent';
                }
                return i.name || 'Sin intent';
            }),
            datasets: [{
                label: 'Usos',
                data: intents.map(i => i.count),
                backgroundColor: '#667eea'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: { beginAtZero: true }
            }
        }
    });
}

/**
 * Cargar gráfico de top FAQs
 */
async function loadFaqsChart() {
    const params = new URLSearchParams({
        startDate: currentDates.start.toISOString(),
        endDate: currentDates.end.toISOString(),
        limit: '10'
    });
    
    const data = await fetchWithTimeout(`${ANALYTICS_API_URL}/faqs/top?${params}`);
    
    if (!data.success) {
        throw new Error('Error al cargar FAQs');
    }
    
    const faqs = data.data || [];
    
    if (chartsInstances['faqs']) {
        chartsInstances['faqs'].destroy();
    }
    
    const ctx = document.getElementById('faqs-chart').getContext('2d');
    chartsInstances['faqs'] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: faqs.map(f => {
                const question = f.question || 'Sin pregunta';
                return question.length > 30 ? question.substring(0, 30) + '...' : question;
            }),
            datasets: [{
                label: 'Usos',
                data: faqs.map(f => f.usageCount || 0),
                backgroundColor: '#f39c12'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: { beginAtZero: true }
            }
        }
    });
}

/**
 * Cargar gráfico de tickets por estado
 */
async function loadTicketsChart() {
    const params = new URLSearchParams({
        startDate: currentDates.start.toISOString(),
        endDate: currentDates.end.toISOString()
    });
    
    const data = await fetchWithTimeout(`${ANALYTICS_API_URL}/tickets/status?${params}`);
    
    if (!data.success) {
        throw new Error('Error al cargar tickets');
    }
    
    const tickets = data.data;
    
    if (chartsInstances['tickets']) {
        chartsInstances['tickets'].destroy();
    }
    
    const ctx = document.getElementById('tickets-chart').getContext('2d');
    chartsInstances['tickets'] = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: tickets.map(t => {
                const labels = {
                    'pending': '⏳ Pendientes',
                    'assigned': '👤 Asignados',
                    'resolved': '✅ Resueltos'
                };
                return labels[t.status] || t.status;
            }),
            datasets: [{
                data: tickets.map(t => t.count),
                backgroundColor: ['#ffc107', '#17a2b8', '#28a745']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
}

/**
 * Cargar patrones de uso por hora
 */
async function loadUsagePatterns() {
    const params = new URLSearchParams({
        startDate: currentDates.start.toISOString(),
        endDate: currentDates.end.toISOString()
    });
    
    const data = await fetchWithTimeout(`${ANALYTICS_API_URL}/usage-patterns?${params}`);
    
    if (!data.success) {
        throw new Error('Error al cargar patrones de uso');
    }
    
    const patterns = data.data;
    
    // Completar todas las 24 horas (algunas pueden no tener datos)
    const fullData = Array.from({length: 24}, (_, i) => {
        const found = patterns.find(p => p.hour === i);
        return found ? found.count : 0;
    });
    
    if (chartsInstances['usage']) {
        chartsInstances['usage'].destroy();
    }
    
    const ctx = document.getElementById('usage-chart').getContext('2d');
    chartsInstances['usage'] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Array.from({length: 24}, (_, i) => `${i}:00`),
            datasets: [{
                label: 'Consultas',
                data: fullData,
                backgroundColor: '#764ba2'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

/**
 * Cargar gráfico de intents con baja confianza
 */
async function loadLowConfidenceChart() {
    const params = new URLSearchParams({
        startDate: currentDates.start.toISOString(),
        endDate: currentDates.end.toISOString(),
        threshold: '0.7'
    });
    
    const data = await fetchWithTimeout(`${ANALYTICS_API_URL}/low-confidence?${params}`);
    
    if (!data.success) {
        throw new Error('Error al cargar intents de baja confianza');
    }
    
    const intents = data.data.slice(0, 10);
    
    if (chartsInstances['lowConfidence']) {
        chartsInstances['lowConfidence'].destroy();
    }
    
    const ctx = document.getElementById('low-confidence-chart').getContext('2d');
    chartsInstances['lowConfidence'] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: intents.map(i => i.intent || 'Sin intent'),
            datasets: [{
                label: 'Confianza Promedio',
                data: intents.map(i => (i.avgConfidence * 100).toFixed(1)),
                backgroundColor: '#dc3545'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: { 
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });
}

/**
 * Cargar gráfico de razones de escalación
 */
async function loadEscalationReasonsChart() {
    const params = new URLSearchParams({
        startDate: currentDates.start.toISOString(),
        endDate: currentDates.end.toISOString()
    });
    
    const data = await fetchWithTimeout(`${ANALYTICS_API_URL}/tickets/escalation-reasons?${params}`);
    
    if (!data.success) {
        throw new Error('Error al cargar razones de escalación');
    }
    
    const reasons = data.data || [];
    
    // Si no hay datos, mostrar mensaje
    if (reasons.length === 0) {
        document.getElementById('escalation-chart').getContext('2d').clearRect(0, 0, 500, 300);
        return;
    }
    
    if (chartsInstances['escalation']) {
        chartsInstances['escalation'].destroy();
    }
    
    const ctx = document.getElementById('escalation-chart').getContext('2d');
    chartsInstances['escalation'] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: reasons.map(r => {
                const reason = r.reason || 'Sin razón';
                return reason.length > 40 ? reason.substring(0, 40) + '...' : reason;
            }),
            datasets: [{
                label: 'Cantidad',
                data: reasons.map(r => r.count),
                backgroundColor: '#6610f2'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: { beginAtZero: true }
            }
        }
    });
}

/**
 * Exportar reporte en Excel
 */
async function exportExcel() {
    const params = new URLSearchParams({
        startDate: currentDates.start.toISOString(),
        endDate: currentDates.end.toISOString()
    });
    
    console.log('📊 Descargando reporte Excel...');
    
    try {
        const response = await fetch(`${ANALYTICS_API_URL}/export/excel?${params}`);
        
        if (!response.ok) {
            throw new Error('Error al generar reporte Excel');
        }
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reporte_analytics_${currentDates.start.toISOString().split('T')[0]}_${currentDates.end.toISOString().split('T')[0]}.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
        
        console.log('✅ Reporte Excel descargado');
    } catch (error) {
        console.error('❌ Error al exportar Excel:', error);
        alert('Error al descargar el reporte Excel. Verifica que el servicio Analytics esté corriendo en el puerto 3006.');
    }
}

/**
 * Exportar reporte en PDF
 */
async function exportPDF() {
    const params = new URLSearchParams({
        startDate: currentDates.start.toISOString(),
        endDate: currentDates.end.toISOString()
    });
    
    console.log('📄 Descargando reporte PDF...');
    
    try {
        const response = await fetch(`${ANALYTICS_API_URL}/export/pdf?${params}`);
        
        if (!response.ok) {
            throw new Error('Error al generar reporte PDF');
        }
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reporte_analytics_${currentDates.start.toISOString().split('T')[0]}_${currentDates.end.toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
        
        console.log('✅ Reporte PDF descargado');
    } catch (error) {
        console.error('❌ Error al exportar PDF:', error);
        alert('Error al descargar el reporte PDF. Verifica que el servicio Analytics esté corriendo en el puerto 3006.');
    }
}
