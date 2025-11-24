<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard de Métricas - UPT Chat System</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }

        .container {
            max-width: 1400px;
            margin: 0 auto;
        }

        header {
            background: white;
            padding: 20px 30px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            margin-bottom: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 15px;
        }

        h1 {
            color: #667eea;
            font-size: 24px;
        }

        .controls {
            display: flex;
            gap: 10px;
            align-items: center;
            flex-wrap: wrap;
        }

        select, input[type="date"], button {
            padding: 8px 15px;
            border: 2px solid #667eea;
            border-radius: 5px;
            font-size: 14px;
            outline: none;
            transition: all 0.3s;
        }

        button {
            background: #667eea;
            color: white;
            cursor: pointer;
            font-weight: 600;
        }

        button:hover {
            background: #5568d3;
            transform: translateY(-2px);
        }

        .loading {
            text-align: center;
            padding: 40px;
            background: white;
            border-radius: 10px;
            margin: 20px 0;
            display: none;
        }

        .loading.active {
            display: block;
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 20px;
        }

        .stat-card {
            background: white;
            padding: 25px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            text-align: center;
        }

        .stat-card h3 {
            color: #666;
            font-size: 14px;
            margin-bottom: 10px;
            text-transform: uppercase;
        }

        .stat-card .value {
            color: #667eea;
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 5px;
        }

        .stat-card .label {
            color: #999;
            font-size: 12px;
        }

        .export-menu {
            background: white;
            padding: 15px 20px;
            border-radius: 10px;
            margin-bottom: 20px;
            display: flex;
            gap: 10px;
            justify-content: center;
            flex-wrap: wrap;
        }

        .export-menu button {
            min-width: 150px;
        }

        .charts-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
            gap: 20px;
            margin-bottom: 20px;
        }

        .chart-card {
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            min-height: 300px;
        }

        .chart-card h3 {
            color: #667eea;
            margin-bottom: 15px;
            font-size: 18px;
        }

        .chart-card canvas {
            max-height: 300px;
        }

        .back-button {
            background: white;
            color: #667eea;
            border: 2px solid #667eea;
            padding: 10px 20px;
            border-radius: 5px;
            text-decoration: none;
            display: inline-block;
            margin-top: 20px;
            transition: all 0.3s;
        }

        .back-button:hover {
            background: #667eea;
            color: white;
            transform: translateY(-2px);
        }

        .error-message {
            background: #ff6b6b;
            color: white;
            padding: 15px;
            border-radius: 10px;
            margin: 20px 0;
            display: none;
        }

        .error-message.active {
            display: block;
        }

        @media (max-width: 768px) {
            .charts-grid {
                grid-template-columns: 1fr;
            }
            
            header {
                flex-direction: column;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <div>
                <h1>📊 Dashboard de Métricas en Tiempo Real</h1>
                <p style="color: #666; font-size: 14px; margin-top: 5px;">UPT Chat System - Analytics</p>
            </div>
            <div class="controls">
                <select id="period-select">
                    <option value="7">Últimos 7 días</option>
                    <option value="30" selected>Últimos 30 días</option>
                    <option value="90">Últimos 90 días</option>
                    <option value="custom">Personalizado</option>
                </select>
                <input type="date" id="start-date" style="display:none;">
                <input type="date" id="end-date" style="display:none;">
                <button onclick="updateDashboard()">🔄 Actualizar</button>
            </div>
        </header>

        <div class="loading" id="loading">
            <p>⏳ Cargando datos...</p>
        </div>

        <div class="error-message" id="error-message">
            <p id="error-text"></p>
            <button onclick="updateDashboard()" style="margin-top: 10px;">🔄 Reintentar</button>
        </div>

        <!-- Estadísticas Generales -->
        <div class="stats-grid" id="stats-grid">
            <!-- Se llenarán dinámicamente con JavaScript -->
        </div>

        <!-- Menú de Exportación -->
        <div class="export-menu">
            <button onclick="exportExcel()">📊 Descargar Excel</button>
            <button onclick="exportPDF()">📄 Descargar PDF</button>
        </div>

        <!-- Gráficos -->
        <div class="charts-grid">
            <div class="chart-card">
                <h3>📈 Consultas por Día</h3>
                <canvas id="queries-chart"></canvas>
            </div>

            <div class="chart-card">
                <h3>👍 Distribución de Feedback</h3>
                <canvas id="feedback-chart"></canvas>
            </div>

            <div class="chart-card">
                <h3>🎯 Top 10 Intents</h3>
                <canvas id="intents-chart"></canvas>
            </div>

            <div class="chart-card">
                <h3>❓ Top 10 FAQs</h3>
                <canvas id="faqs-chart"></canvas>
            </div>

            <div class="chart-card">
                <h3>🎫 Tickets por Estado</h3>
                <canvas id="tickets-chart"></canvas>
            </div>

            <div class="chart-card">
                <h3>⏰ Patrones de Uso por Hora</h3>
                <canvas id="usage-chart"></canvas>
            </div>

            <div class="chart-card">
                <h3>⚠️ Intents con Baja Confianza</h3>
                <canvas id="low-confidence-chart"></canvas>
            </div>

            <div class="chart-card">
                <h3>📊 Razones de Escalación</h3>
                <canvas id="escalation-chart"></canvas>
            </div>
        </div>

        <a href="/admin" class="back-button">← Volver al Panel de Administración</a>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
    <script src="/js/admin-analytics.js"></script>
</body>
</html>
