<?php
require_once __DIR__ . '/../config/session.php';
require_once __DIR__ . '/../app/controllers/AuthController.php';

// Verificar autenticación y tipo de usuario
if (!isset($_SESSION['user_id']) || $_SESSION['tipo_usuario'] !== 'administrativo') {
    header('Location: login.php');
    exit();
}

$userName = $_SESSION['nombre_completo'] ?? 'Administrador';
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard de Métricas - Sistema UPT</title>
    <link rel="stylesheet" href="css/style.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
    <style>
        .analytics-container {
            padding: 20px;
            max-width: 1400px;
            margin: 0 auto;
        }

        .analytics-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 10px;
        }

        .period-selector {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
        }

        .period-btn {
            padding: 10px 20px;
            border: none;
            background: #f0f0f0;
            cursor: pointer;
            border-radius: 5px;
            font-weight: 500;
            transition: all 0.3s;
        }

        .period-btn.active {
            background: #667eea;
            color: white;
        }

        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }

        .metric-card {
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .metric-value {
            font-size: 36px;
            font-weight: bold;
            color: #667eea;
            margin: 10px 0;
        }

        .metric-label {
            color: #6c757d;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .metric-change {
            font-size: 12px;
            margin-top: 5px;
        }

        .metric-change.positive {
            color: #28a745;
        }

        .metric-change.negative {
            color: #dc3545;
        }

        .charts-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }

        .chart-card {
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .chart-title {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 15px;
            color: #333;
        }

        .chart-container {
            position: relative;
            height: 300px;
        }

        .refresh-info {
            text-align: center;
            color: #6c757d;
            font-size: 12px;
            margin-top: 20px;
        }

        .loading {
            text-align: center;
            padding: 40px;
            color: #6c757d;
        }
    </style>
</head>
<body>
    <div class="dashboard-container">
        <div class="sidebar">
            <div class="sidebar-header">
                <h2>🎓 Sistema UPT</h2>
            </div>
            <ul class="menu">
                <li><a href="admin_dashboard.php">📊 Dashboard</a></li>
                <li><a href="admin_faqs.php">❓ Gestión FAQs</a></li>
                <li><a href="admin_tickets.php">🎫 Tickets de Soporte</a></li>
                <li><a href="admin_analytics.php" class="active">📈 Métricas</a></li>
                <li><a href="logout.php">🚪 Cerrar Sesión</a></li>
            </ul>
        </div>

        <div class="main-content">
            <div class="analytics-container">
                <div class="analytics-header">
                    <div>
                        <h1>📈 Dashboard de Métricas</h1>
                        <p>Administrador: <?php echo htmlspecialchars($userName); ?></p>
                    </div>
                    <div id="last-update"></div>
                </div>

                <div class="period-selector">
                    <button class="period-btn active" onclick="changePeriod('day')">Hoy</button>
                    <button class="period-btn" onclick="changePeriod('week')">Esta Semana</button>
                    <button class="period-btn" onclick="changePeriod('month')">Este Mes</button>
                </div>

                <div id="loading" class="loading">Cargando métricas...</div>

                <div id="metrics-content" style="display: none;">
                    <div class="metrics-grid">
                        <div class="metric-card">
                            <div class="metric-label">Total de Consultas</div>
                            <div class="metric-value" id="total-queries">0</div>
                        </div>

                        <div class="metric-card">
                            <div class="metric-label">Confianza Promedio</div>
                            <div class="metric-value" id="avg-confidence">0%</div>
                        </div>

                        <div class="metric-card">
                            <div class="metric-label">Tickets Escalados</div>
                            <div class="metric-value" id="escalated-tickets">0</div>
                            <div class="metric-change" id="escalation-rate"></div>
                        </div>

                        <div class="metric-card">
                            <div class="metric-label">Satisfacción</div>
                            <div class="metric-value" id="satisfaction-rate">0%</div>
                            <div class="metric-change" id="feedback-details"></div>
                        </div>
                    </div>

                    <div class="charts-grid">
                        <div class="chart-card">
                            <div class="chart-title">📊 Consultas por Día</div>
                            <div class="chart-container">
                                <canvas id="queriesChart"></canvas>
                            </div>
                        </div>

                        <div class="chart-card">
                            <div class="chart-title">🎯 Top 10 Intents</div>
                            <div class="chart-container">
                                <canvas id="intentsChart"></canvas>
                            </div>
                        </div>

                        <div class="chart-card">
                            <div class="chart-title">⚠️ Tasa de Escalamiento</div>
                            <div class="chart-container">
                                <canvas id="escalationChart"></canvas>
                            </div>
                        </div>

                        <div class="chart-card">
                            <div class="chart-title">👍 Feedback de Usuarios</div>
                            <div class="chart-container">
                                <canvas id="feedbackChart"></canvas>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="refresh-info">
                    Auto-actualización cada 30 segundos
                </div>
            </div>
        </div>
    </div>

    <script>
        const API_URL = 'http://localhost:3000/api/v1';
        let currentPeriod = 'day';
        let charts = {};
        let refreshInterval;

        // Cargar datos al iniciar
        document.addEventListener('DOMContentLoaded', () => {
            loadAnalytics();
            startAutoRefresh();
        });

        async function loadAnalytics() {
            try {
                const response = await fetch(`${API_URL}/analytics/dashboard?period=${currentPeriod}`);
                const result = await response.json();

                if (result.success) {
                    displayMetrics(result.data);
                    updateCharts(result.data);
                    document.getElementById('loading').style.display = 'none';
                    document.getElementById('metrics-content').style.display = 'block';
                    updateTimestamp();
                }
            } catch (error) {
                console.error('Error cargando analytics:', error);
                document.getElementById('loading').innerHTML = '❌ Error cargando métricas';
            }
        }

        function displayMetrics(data) {
            document.getElementById('total-queries').textContent = data.totalQueries.toLocaleString();
            document.getElementById('avg-confidence').textContent = Math.round(data.avgConfidence * 100) + '%';
            document.getElementById('escalated-tickets').textContent = data.escalatedTickets.toLocaleString();
            document.getElementById('escalation-rate').textContent = `Tasa: ${data.escalationRate}%`;
            document.getElementById('escalation-rate').className = data.escalationRate < 10 ? 'metric-change positive' : 'metric-change negative';
            
            document.getElementById('satisfaction-rate').textContent = data.feedbackStats.ratio + '%';
            document.getElementById('feedback-details').textContent = 
                `👍 ${data.feedbackStats.positive} | 👎 ${data.feedbackStats.negative}`;
            document.getElementById('feedback-details').className = 
                data.feedbackStats.ratio > 70 ? 'metric-change positive' : 'metric-change negative';
        }

        async function updateCharts(data) {
            // Gráfico de consultas por día
            const timeSeriesResponse = await fetch(`${API_URL}/analytics/timeseries?period=${currentPeriod}`);
            const timeSeriesResult = await timeSeriesResponse.json();

            if (timeSeriesResult.success) {
                const dates = [...new Set(timeSeriesResult.data.map(d => d._id.date))];
                const userQueries = dates.map(date => {
                    const item = timeSeriesResult.data.find(d => d._id.date === date && d._id.sender === 'user');
                    return item ? item.count : 0;
                });

                updateOrCreateChart('queriesChart', 'line', {
                    labels: dates,
                    datasets: [{
                        label: 'Consultas de Usuarios',
                        data: userQueries,
                        borderColor: '#667eea',
                        backgroundColor: 'rgba(102, 126, 234, 0.1)',
                        tension: 0.4
                    }]
                });
            }

            // Gráfico de intents
            const intents = Object.keys(data.intentBreakdown);
            const intentCounts = Object.values(data.intentBreakdown);

            updateOrCreateChart('intentsChart', 'bar', {
                labels: intents,
                datasets: [{
                    label: 'Consultas por Intent',
                    data: intentCounts,
                    backgroundColor: '#764ba2'
                }]
            }, {
                indexAxis: 'y'
            });

            // Gráfico de escalamiento
            const resolvedAuto = data.totalQueries - data.escalatedTickets;
            updateOrCreateChart('escalationChart', 'doughnut', {
                labels: ['Resueltas Automáticamente', 'Escaladas'],
                datasets: [{
                    data: [resolvedAuto, data.escalatedTickets],
                    backgroundColor: ['#28a745', '#ffc107']
                }]
            });

            // Gráfico de feedback
            updateOrCreateChart('feedbackChart', 'pie', {
                labels: ['Positivo', 'Negativo'],
                datasets: [{
                    data: [data.feedbackStats.positive, data.feedbackStats.negative],
                    backgroundColor: ['#28a745', '#dc3545']
                }]
            });
        }

        function updateOrCreateChart(canvasId, type, data, options = {}) {
            const canvas = document.getElementById(canvasId);
            const ctx = canvas.getContext('2d');

            if (charts[canvasId]) {
                charts[canvasId].data = data;
                charts[canvasId].update();
            } else {
                charts[canvasId] = new Chart(ctx, {
                    type: type,
                    data: data,
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        ...options
                    }
                });
            }
        }

        function changePeriod(period) {
            currentPeriod = period;
            
            // Actualizar UI
            document.querySelectorAll('.period-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            event.target.classList.add('active');
            
            // Recargar datos
            loadAnalytics();
        }

        function updateTimestamp() {
            const now = new Date();
            document.getElementById('last-update').textContent = 
                `Última actualización: ${now.toLocaleTimeString('es-PE')}`;
        }

        function startAutoRefresh() {
            // Actualizar cada 30 segundos
            refreshInterval = setInterval(() => {
                loadAnalytics();
            }, 30000);
        }

        // Limpiar interval al salir
        window.addEventListener('beforeunload', () => {
            if (refreshInterval) {
                clearInterval(refreshInterval);
            }
        });
    </script>
</body>
</html>
