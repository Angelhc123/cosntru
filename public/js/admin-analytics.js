/**
 * Dashboard de Analytics - Frontend
 * Conecta con Analytics Service en puerto 3006
 */

const ANALYTICS_API_URL = 'https://analytics-service-production-effe.up.railway.app';

let chartsInstances = {};
let currentDates = {
    start: null,
    end: null
};

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
    
    // Mostrar loading
    document.getElementById('loading').style.display = 'block';
    document.getElementById('content').style.display = 'none';
    
    try {
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
        document.getElementById('loading').innerHTML = `
            <div style="color: #ff6b6b;">
                ❌ Error al cargar datos<br>
                <small>${error.message}</small><br><br>
                <button class="btn" onclick="updateDashboard()">🔄 Reintentar</button>
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
    
    const response = await fetch(`${ANALYTICS_API_URL}/dashboard?${params}`);
    const data = await response.json();
    
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
    
    const response = await fetch(`${ANALYTICS_API_URL}/queries?${params}`);
    const data = await response.json();
    
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
    
    const response = await fetch(`${ANALYTICS_API_URL}/feedback?${params}`);
    const data = await response.json();
    
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
        endDate: currentDates.end.toISOString()
    });
    
    const response = await fetch(`${ANALYTICS_API_URL}/dashboard?${params}`);
    const data = await response.json();
    
    if (!data.success) {
        throw new Error('Error al cargar intents');
    }
    
    const intents = data.data.topIntents.slice(0, 10);
    
    if (chartsInstances['intents']) {
        chartsInstances['intents'].destroy();
    }
    
    const ctx = document.getElementById('intents-chart').getContext('2d');
    chartsInstances['intents'] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: intents.map(i => i.intent || 'Sin intent'),
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
        endDate: currentDates.end.toISOString()
    });
    
    const response = await fetch(`${ANALYTICS_API_URL}/dashboard?${params}`);
    const data = await response.json();
    
    if (!data.success) {
        throw new Error('Error al cargar FAQs');
    }
    
    const faqs = data.data.topFaqs.slice(0, 10);
    
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
                data: faqs.map(f => f.count),
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
    
    const response = await fetch(`${ANALYTICS_API_URL}/tickets/status?${params}`);
    const data = await response.json();
    
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
    
    const response = await fetch(`${ANALYTICS_API_URL}/usage-patterns?${params}`);
    const data = await response.json();
    
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
    
    const response = await fetch(`${ANALYTICS_API_URL}/low-confidence?${params}`);
    const data = await response.json();
    
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
    
    const response = await fetch(`${ANALYTICS_API_URL}/tickets/escalation-reasons?${params}`);
    const data = await response.json();
    
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
