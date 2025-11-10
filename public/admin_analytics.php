<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard de Métricas - UPT Chat System</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
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
            padding: 25px 30px;
            border-radius: 15px;
            margin-bottom: 25px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.1);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        header h1 {
            color: #333;
            font-size: 28px;
        }

        header p {
            color: #666;
            margin-top: 5px;
        }

        .controls {
            display: flex;
            gap: 15px;
            align-items: center;
        }

        .date-selector {
            display: flex;
            gap: 10px;
            align-items: center;
        }

        .date-selector select,
        .date-selector input {
            padding: 10px 15px;
            border: 2px solid #ddd;
            border-radius: 8px;
            font-size: 14px;
        }

        .btn {
            padding: 10px 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s;
        }

        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }

        .btn-export {
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 25px;
        }

        .stat-card {
            background: white;
            padding: 25px;
            border-radius: 15px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.1);
            text-align: center;
            transition: transform 0.3s;
        }

        .stat-card:hover {
            transform: translateY(-5px);
        }

        .stat-card .icon {
            font-size: 48px;
            margin-bottom: 10px;
        }

        .stat-card .value {
            font-size: 36px;
            font-weight: bold;
            color: #667eea;
            margin: 10px 0;
        }

        .stat-card .label {
            color: #666;
            font-size: 14px;
            font-weight: 600;
        }

        .charts-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
            gap: 20px;
            margin-bottom: 25px;
        }

        .chart-card {
            background: white;
            padding: 25px;
            border-radius: 15px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.1);
        }

        .chart-card h3 {
            color: #333;
            margin-bottom: 20px;
            font-size: 18px;
        }

        .chart-container {
            position: relative;
            height: 300px;
        }

        .loading {
            text-align: center;
            padding: 40px;
            color: white;
            font-size: 18px;
        }

        .export-menu {
            background: white;
            padding: 20px;
            border-radius: 15px;
            margin-bottom: 25px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.1);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .export-menu h3 {
            color: #333;
            font-size: 18px;
        }

        .export-buttons {
            display: flex;
            gap: 10px;
        }

        .btn-excel {
            background: linear-gradient(135deg, #217346 0%, #34a853 100%);
        }

        .btn-pdf {
            background: linear-gradient(135deg, #d32f2f 0%, #f44336 100%);
        }

        .back-button {
            background: linear-gradient(135deg, #6c757d 0%, #495057 100%);
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <div>
                <h1>📊 Dashboard de Métricas en Tiempo Real</h1>
                <p>UPT Chat System - Análisis y Reportes</p>
            </div>
            <div class="controls">
                <div class="date-selector">
                    <select id="period-select" onchange="updateDashboard()">
                        <option value="7">Últimos 7 días</option>
                        <option value="30" selected>Últimos 30 días</option>
                        <option value="90">Últimos 90 días</option>
                        <option value="custom">Personalizado</option>
                    </select>
                    <input type="date" id="start-date" style="display:none;">
                    <input type="date" id="end-date" style="display:none;">
                </div>
                <button class="btn" onclick="updateDashboard()">🔄 Actualizar</button>
                <button class="btn back-button" onclick="window.location.href='admin_dashboard.php'">← Volver</button>
            </div>
        </header>

        <div id="loading" class="loading">⏳ Cargando métricas...</div>

        <div id="content" style="display: none;">
            <!-- Estadísticas Generales -->
            <div class="stats-grid" id="stats-grid"></div>

            <!-- Menú de Exportación -->
            <div class="export-menu">
                <h3>📥 Exportar Reportes</h3>
                <div class="export-buttons">
                    <button class="btn btn-excel" onclick="exportExcel()">
                        📊 Descargar Excel
                    </button>
                    <button class="btn btn-pdf" onclick="exportPDF()">
                        📄 Descargar PDF
                    </button>
                </div>
            </div>

            <!-- Gráficos -->
            <div class="charts-grid">
                <!-- Gráfico de Consultas por Día -->
                <div class="chart-card">
                    <h3>📈 Consultas por Día</h3>
                    <div class="chart-container">
                        <canvas id="queries-chart"></canvas>
                    </div>
                </div>

                <!-- Gráfico de Feedback -->
                <div class="chart-card">
                    <h3>👍👎 Distribución de Feedback</h3>
                    <div class="chart-container">
                        <canvas id="feedback-chart"></canvas>
                    </div>
                </div>

                <!-- Gráfico de Top Intents -->
                <div class="chart-card">
                    <h3>🎯 Top 10 Intents</h3>
                    <div class="chart-container">
                        <canvas id="intents-chart"></canvas>
                    </div>
                </div>

                <!-- Gráfico de Top FAQs -->
                <div class="chart-card">
                    <h3>❓ Top 10 Preguntas Frecuentes</h3>
                    <div class="chart-container">
                        <canvas id="faqs-chart"></canvas>
                    </div>
                </div>

                <!-- Gráfico de Tickets por Estado -->
                <div class="chart-card">
                    <h3>🎫 Tickets por Estado</h3>
                    <div class="chart-container">
                        <canvas id="tickets-chart"></canvas>
                    </div>
                </div>

                <!-- Gráfico de Patrones de Uso por Hora -->
                <div class="chart-card">
                    <h3>⏰ Patrones de Uso por Hora</h3>
                    <div class="chart-container">
                        <canvas id="usage-chart"></canvas>
                    </div>
                </div>

                <!-- Gráfico de Intents con Baja Confianza -->
                <div class="chart-card">
                    <h3>⚠️ Intents con Baja Confianza (<70%)</h3>
                    <div class="chart-container">
                        <canvas id="low-confidence-chart"></canvas>
                    </div>
                </div>

                <!-- Gráfico de Razones de Escalación -->
                <div class="chart-card">
                    <h3>📊 Razones de Escalación</h3>
                    <div class="chart-container">
                        <canvas id="escalation-chart"></canvas>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="js/admin-analytics.js"></script>
</body>
</html>
