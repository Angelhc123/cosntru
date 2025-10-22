<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Panel de Administración - UPT</title>
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

        .admin-container {
            max-width: 1200px;
            margin: 0 auto;
        }

        .admin-header {
            background: white;
            padding: 20px 30px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            margin-bottom: 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .admin-header h1 {
            color: #667eea;
            font-size: 28px;
        }

        .user-info {
            display: flex;
            align-items: center;
            gap: 15px;
        }

        .user-info span {
            color: #666;
            font-size: 14px;
        }

        .btn-logout {
            background: #e74c3c;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            text-decoration: none;
            display: inline-block;
        }

        .btn-logout:hover {
            background: #c0392b;
        }

        .cards-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }

        .card {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            cursor: pointer;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            text-decoration: none;
            color: inherit;
            display: block;
        }

        .card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 15px rgba(0,0,0,0.2);
        }

        .card-icon {
            font-size: 48px;
            margin-bottom: 15px;
        }

        .card-title {
            font-size: 22px;
            color: #333;
            margin-bottom: 10px;
            font-weight: 600;
        }

        .card-description {
            font-size: 14px;
            color: #666;
            line-height: 1.6;
        }

        .card-faq {
            border-left: 4px solid #667eea;
        }

        .card-stats {
            border-left: 4px solid #48bb78;
        }

        .badge-admin {
            background: #667eea;
            color: white;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
        }
    </style>
</head>
<body>
    <div class="admin-container">
        <div class="admin-header">
            <div>
                <h1>🎛️ Panel de Administración</h1>
                <div style="color: #999; font-size: 14px; margin-top: 5px;">
                    Sistema de Gestión del Asistente Virtual UPT
                </div>
            </div>
            <div class="user-info">
                <span class="badge-admin">ADMINISTRATIVO</span>
                <span><strong><?php echo $_SESSION['nombre_completo']; ?></strong></span>
                <a href="logout.php" class="btn-logout">Cerrar Sesión</a>
            </div>
        </div>

        <div class="cards-grid">
            <a href="admin_faqs.php" class="card card-faq">
                <div class="card-icon">📋</div>
                <div class="card-title">Gestión de FAQs</div>
                <div class="card-description">
                    Administra las preguntas frecuentes del chatbot. 
                    Edita, activa o desactiva las respuestas rápidas que verán los usuarios.
                </div>
            </a>

            <a href="admin_stats.php" class="card card-stats">
                <div class="card-icon">📊</div>
                <div class="card-title">Estadísticas del Modelo</div>
                <div class="card-description">
                    Visualiza métricas de uso, rendimiento del modelo NLP y análisis de conversaciones.
                    <br><br>
                    <span style="color: #999; font-style: italic;">(Próximamente)</span>
                </div>
            </a>
        </div>
    </div>
</body>
</html>
