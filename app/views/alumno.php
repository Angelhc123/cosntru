<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Alumno - Net.UPT.edu.pe</title>
    <link rel="stylesheet" href="/public/css/style.css">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: Arial, sans-serif;
            background-color: #f5f5f5;
            padding: 20px;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .header {
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            color: white;
            padding: 15px 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .header h1 {
            font-size: 20px;
            font-weight: normal;
        }

        .header-buttons {
            display: flex;
            gap: 10px;
        }

        .header-buttons a {
            color: white;
            text-decoration: none;
            padding: 6px 12px;
            border: 1px solid white;
            border-radius: 4px;
            font-size: 13px;
            transition: background 0.3s;
        }

        .header-buttons a:hover {
            background: rgba(255,255,255,0.2);
        }

        .student-info {
            display: flex;
            gap: 20px;
            padding: 20px 30px;
            border-bottom: 3px solid #1e3c72;
        }

        .student-photo {
            flex-shrink: 0;
        }

        .student-photo img {
            width: 120px;
            height: 140px;
            object-fit: cover;
            border: 3px solid #1e3c72;
            border-radius: 4px;
        }

        .student-photo .logo {
            margin-top: 10px;
            font-size: 11px;
            font-weight: bold;
            color: #1e3c72;
            text-align: center;
        }

        .student-details {
            flex: 1;
        }

        .student-name {
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            color: white;
            padding: 8px 15px;
            margin-bottom: 10px;
            font-weight: bold;
            font-size: 14px;
        }

        .student-code {
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            color: white;
            padding: 8px 15px;
            margin-bottom: 10px;
            font-weight: bold;
            font-size: 13px;
        }

        .student-career {
            padding: 8px 15px;
            margin-bottom: 5px;
            font-size: 13px;
        }

        .semesters {
            display: flex;
            flex-wrap: wrap;
            gap: 5px;
            padding: 0 15px;
        }

        .semester {
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            color: white;
            padding: 4px 10px;
            font-size: 11px;
            border-radius: 3px;
        }

        .tabs {
            display: flex;
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            border-top: 1px solid #163057;
        }

        .tab {
            flex: 1;
            padding: 12px 20px;
            text-align: center;
            color: white;
            cursor: pointer;
            border-right: 1px solid rgba(255,255,255,0.2);
            font-weight: bold;
            font-size: 14px;
            transition: background 0.3s;
        }

        .tab:last-child {
            border-right: none;
        }

        .tab:hover {
            background: rgba(255,255,255,0.1);
        }

        .tab.active {
            background: rgba(255,255,255,0.25);
            box-shadow: inset 0 2px 4px rgba(0,0,0,0.2);
        }

        .content {
            padding: 30px;
            min-height: 400px;
        }

        .section {
            display: none;
        }

        .section.active {
            display: block;
        }

        .section-title {
            color: #1e3c72;
            font-size: 18px;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #1e3c72;
        }

        /* Estilos para Horario */
        .schedule-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            font-size: 12px;
        }

        .schedule-table th {
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            color: white;
            padding: 10px 8px;
            text-align: center;
            border: 1px solid #163057;
            font-weight: bold;
        }

        .schedule-table td {
            padding: 8px;
            border: 1px solid #ddd;
            text-align: center;
            vertical-align: middle;
        }

        .schedule-table tbody tr:nth-child(even) {
            background-color: #f9f9f9;
        }

        .schedule-table tbody tr:hover {
            background-color: #e8f0ff;
        }

        .course-code {
            font-weight: bold;
            color: #1e3c72;
        }

        .time-slot {
            font-size: 11px;
            color: #333;
            line-height: 1.4;
        }

        /* Estilos para Notas */
        .course-card {
            margin-bottom: 30px;
            border: 1px solid #ddd;
            border-radius: 6px;
            overflow: hidden;
        }

        .course-header {
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            color: white;
            padding: 12px 20px;
            font-weight: bold;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .print-icon {
            cursor: pointer;
            font-size: 18px;
        }

        .course-content {
            padding: 20px;
        }

        .unit-section {
            margin-bottom: 25px;
        }

        .unit-title {
            color: #d32f2f;
            font-weight: bold;
            margin-bottom: 10px;
            font-size: 14px;
        }

        .grades-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px;
            margin-bottom: 15px;
        }

        .grades-table thead tr {
            background-color: #f5f5f5;
        }

        .grades-table th {
            padding: 8px;
            text-align: center;
            border: 1px solid #ddd;
            font-weight: normal;
            color: #666;
            font-size: 11px;
        }

        .grades-table td {
            padding: 8px;
            text-align: center;
            border: 1px solid #ddd;
        }

        .grades-table tbody tr:hover {
            background-color: #f9f9f9;
        }

        .nota-column {
            font-weight: bold;
            color: #1e3c72;
        }

        .unit-summary {
            display: flex;
            justify-content: flex-end;
            gap: 30px;
            padding: 10px 0;
            font-size: 13px;
            color: #999;
        }

        .course-average {
            text-align: center;
            padding: 15px;
            background-color: #fff3cd;
            border-top: 2px solid #ffc107;
            font-size: 16px;
        }

        .course-average strong {
            color: #d32f2f;
        }

        /* Estilos para Asistencia */
        .attendance-section {
            margin-bottom: 40px;
        }

        .attendance-header {
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            color: white;
            padding: 10px 20px;
            font-weight: bold;
            margin-bottom: 15px;
            font-size: 14px;
        }

        .attendance-table-container {
            overflow-x: auto;
            margin-bottom: 20px;
        }

        .attendance-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 11px;
            margin-bottom: 10px;
        }

        .attendance-table th {
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            color: white;
            padding: 8px 6px;
            text-align: center;
            border: 1px solid #163057;
            font-weight: bold;
        }

        .attendance-table td {
            padding: 8px 6px;
            border: 1px solid #ddd;
            text-align: center;
        }

        .attendance-table tbody tr:nth-child(even) {
            background-color: #f9f9f9;
        }

        .status-asiste {
            color: #28a745;
            font-weight: bold;
        }

        .status-falta {
            color: #dc3545;
            font-weight: bold;
        }

        .status-tardanza {
            color: #ffc107;
            font-weight: bold;
        }

        .date-row {
            font-size: 10px;
        }

        .day-row {
            font-size: 10px;
            font-style: italic;
        }

        @media print {
            .header-buttons, .tabs {
                display: none;
            }
        }
    </style>
</head>
<body>
    <?php
        $usuario = isset($_SESSION['usuario']) ? htmlspecialchars($_SESSION['usuario']) : 'Invitado';
        $nombreCompleto = isset($_SESSION['nombre_completo']) && $_SESSION['nombre_completo'] !== '' ? htmlspecialchars($_SESSION['nombre_completo']) : 'PAJA DE LA CRUZ, Piero Alexander';
        $codigo = '2020067576';
        $carrera = 'Ingeniería de Sistemas';
    ?>

    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>Net.UPT.edu.pe</h1>
            <div class="header-buttons">
                <a href="/dashboard">◀ Ayuda</a>
                <a href="/dashboard">◀ Finalizar</a>
                <a href="/dashboard">🕒 Hora del sistema: <span id="sys-time">11:19:30</span></a>
            </div>
        </div>

        <!-- Student Info -->
        <div class="student-info">
            <div class="student-photo">
                <img src="https://via.placeholder.com/120x140/1e3c72/ffffff?text=Foto" alt="Foto del estudiante">
                <div class="logo">upt</div>
            </div>
            <div class="student-details">
                <div class="student-name"><?php echo strtoupper($nombreCompleto); ?></div>
                <div class="student-code"><?php echo $codigo; ?></div>
                <div class="student-career"><?php echo $carrera; ?></div>
                <div class="semesters">
                    <span class="semester">2020-I</span>
                    <span class="semester">2021-I</span>
                    <span class="semester">2021-II</span>
                    <span class="semester">2022-I</span>
                    <span class="semester">2022-II</span>
                    <span class="semester">2023-I</span>
                    <span class="semester">2023-II</span>
                    <span class="semester">2024-REC</span>
                    <span class="semester">2024-I</span>
                    <span class="semester">2024-II</span>
                    <span class="semester">2025-I</span>
                    <span class="semester">2025-II</span>
                </div>
            </div>
        </div>

        <!-- Tabs -->
        <div class="tabs">
            <div class="tab active" onclick="showSection('horario')">Horario</div>
            <div class="tab" onclick="showSection('notas')">Notas</div>
            <div class="tab" onclick="showSection('asistencia')">Asistencia</div>
        </div>

        <!-- Content -->
        <div class="content">
            <!-- Sección Horario -->
            <div id="horario" class="section active">
                <h2 class="section-title">● Horario</h2>
                <table class="schedule-table">
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Curso</th>
                            <th>Sección</th>
                            <th>Lunes</th>
                            <th>Martes</th>
                            <th>Miércoles</th>
                            <th>Jueves</th>
                            <th>Viernes</th>
                            <th>Sábado</th>
                            <th>Domingo</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="course-code">SI-981</td>
                            <td>TALLER DE TESIS I</td>
                            <td>A</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td class="time-slot">15:50<br>18:20</td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td class="course-code">SI-982</td>
                            <td>PROGRAMACIÓN WEB II</td>
                            <td>A</td>
                            <td></td>
                            <td class="time-slot">17:30<br>19:10</td>
                            <td class="time-slot">17:30<br>19:10</td>
                            <td></td>
                            <td class="time-slot">18:20<br>20:00</td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td class="course-code">SI-983</td>
                            <td>CONSTRUCCIÓN DE SOFTWARE I</td>
                            <td>A</td>
                            <td></td>
                            <td class="time-slot">19:10<br>21:40</td>
                            <td class="time-slot">19:10<br>21:40</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td class="course-code">SI-984</td>
                            <td>REDES Y COMUNICACIÓN DE DATOS II</td>
                            <td>A</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td class="time-slot">20:00<br>21:40</td>
                            <td class="time-slot">20:00<br>21:40</td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td class="course-code">SI-985</td>
                            <td>GESTIÓN DE LA CONFIGURACIÓN DE SOFTWARE</td>
                            <td>A</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td class="time-slot">18:20<br>20:00</td>
                            <td class="time-slot">18:20<br>20:00</td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td class="course-code">SI-989</td>
                            <td>MACHINE LEARNING</td>
                            <td>A</td>
                            <td></td>
                            <td></td>
                            <td class="time-slot">15:00<br>16:40</td>
                            <td class="time-slot">15:50<br>17:30</td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Sección Notas -->
            <div id="notas" class="section">
                <h2 class="section-title">● Record Académico</h2>
                
                <!-- Curso 1: TALLER DE TESIS I -->
                <div class="course-card">
                    <div class="course-header">
                        <span>TALLER DE TESIS I</span>
                        <span class="print-icon">🖨️</span>
                    </div>
                    <div class="course-content">
                        <!-- Unidad I -->
                        <div class="unit-section">
                            <div class="unit-title">Unidad I - 35%</div>
                            <table class="grades-table">
                                <thead>
                                    <tr>
                                        <th>Unidad</th>
                                        <th>Criterio</th>
                                        <th>Peso C.</th>
                                        <th>Peso U.</th>
                                        <th>Nota</th>
                                        <th>Fecha</th>
                                        <th>Descripción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Unidad I</td>
                                        <td>Evaluacion 01</td>
                                        <td>10%</td>
                                        <td>15</td>
                                        <td class="nota-column">-</td>
                                        <td>Sep 20 2025<br>08:17:00:000PM</td>
                                        <td>Actudiañal</td>
                                    </tr>
                                    <tr>
                                        <td>Unidad I</td>
                                        <td>Evaluacion 02</td>
                                        <td>30%</td>
                                        <td>13</td>
                                        <td class="nota-column">-</td>
                                        <td>Sep 20 2025<br>08:16:00:000PM</td>
                                        <td>Trabajo encargado</td>
                                    </tr>
                                    <tr>
                                        <td>Unidad I</td>
                                        <td>Evaluacion 03</td>
                                        <td>20%</td>
                                        <td>12</td>
                                        <td class="nota-column">-</td>
                                        <td>Sep 20 2025<br>06:59:00:000PM</td>
                                        <td>Proyecto</td>
                                    </tr>
                                    <tr>
                                        <td>Unidad I</td>
                                        <td>Evaluacion 04</td>
                                        <td>40%</td>
                                        <td>8</td>
                                        <td class="nota-column">-</td>
                                        <td>Sep 20 2025<br>06:10:00:000PM</td>
                                        <td>Examen de unidad</td>
                                    </tr>
                                </tbody>
                            </table>
                            <div class="unit-summary">
                                <span>100%</span>
                                <span>11.00</span>
                            </div>
                        </div>

                        <!-- Unidad II -->
                        <div class="unit-section">
                            <div class="unit-title">Unidad II - 35%</div>
                            <table class="grades-table">
                                <thead>
                                    <tr>
                                        <th>Unidad</th>
                                        <th>Criterio</th>
                                        <th>Peso C.</th>
                                        <th>Peso U.</th>
                                        <th>Nota</th>
                                        <th>Fecha</th>
                                        <th>Descripción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Unidad II</td>
                                        <td>Evaluacion 01</td>
                                        <td>10%</td>
                                        <td>13</td>
                                        <td class="nota-column">-</td>
                                        <td>Nov 03 2025<br>10:26:00:000PM</td>
                                        <td>Actudiañal</td>
                                    </tr>
                                    <tr>
                                        <td>Unidad II</td>
                                        <td>Evaluacion 02</td>
                                        <td>20%</td>
                                        <td>11</td>
                                        <td class="nota-column">-</td>
                                        <td>Nov 09 2025<br>02:05:00:000AM</td>
                                        <td>Trabajo encargado</td>
                                    </tr>
                                    <tr>
                                        <td>Unidad II</td>
                                        <td>Evaluacion 03</td>
                                        <td>30%</td>
                                        <td>8</td>
                                        <td class="nota-column">-</td>
                                        <td>Nov 08 2025<br>12:55:00:000AM</td>
                                        <td>Proyecto</td>
                                    </tr>
                                    <tr>
                                        <td>Unidad II</td>
                                        <td>Evaluacion 04</td>
                                        <td>40%</td>
                                        <td>16</td>
                                        <td class="nota-column">-</td>
                                        <td>Nov 03 2025<br>10:12:00:000PM</td>
                                        <td>Examen de unidad</td>
                                    </tr>
                                </tbody>
                            </table>
                            <div class="unit-summary">
                                <span>100%</span>
                                <span>12.30</span>
                            </div>
                        </div>

                        <!-- Unidad III -->
                        <div class="unit-section">
                            <div class="unit-title">Unidad III - 30%</div>
                            <table class="grades-table">
                                <thead>
                                    <tr>
                                        <th>Unidad</th>
                                        <th>Criterio</th>
                                        <th>Peso C.</th>
                                        <th>Peso U.</th>
                                        <th>Nota</th>
                                        <th>Fecha</th>
                                        <th>Descripción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Unidad III</td>
                                        <td>Evaluacion 01</td>
                                        <td>10%</td>
                                        <td></td>
                                        <td class="nota-column">-</td>
                                        <td></td>
                                        <td>Actudiañal</td>
                                    </tr>
                                    <tr>
                                        <td>Unidad III</td>
                                        <td>Evaluacion 02</td>
                                        <td>20%</td>
                                        <td></td>
                                        <td class="nota-column">-</td>
                                        <td></td>
                                        <td>Trabajo encargado</td>
                                    </tr>
                                    <tr>
                                        <td>Unidad III</td>
                                        <td>Evaluacion 03</td>
                                        <td>40%</td>
                                        <td></td>
                                        <td class="nota-column">-</td>
                                        <td></td>
                                        <td>Proyecto</td>
                                    </tr>
                                    <tr>
                                        <td>Unidad III</td>
                                        <td>Evaluacion 04</td>
                                        <td>30%</td>
                                        <td></td>
                                        <td class="nota-column">-</td>
                                        <td></td>
                                        <td>Examen de unidad</td>
                                    </tr>
                                </tbody>
                            </table>
                            <div class="unit-summary">
                                <span>100%</span>
                                <span>0.00</span>
                            </div>
                        </div>

                        <div class="course-average">
                            El promedio actual del curso es: <strong>8</strong>
                        </div>
                    </div>
                </div>

                <!-- Curso 2: PROGRAMACIÓN WEB II -->
                <div class="course-card">
                    <div class="course-header">
                        <span>PROGRAMACIÓN WEB II</span>
                        <span class="print-icon">🖨️</span>
                    </div>
                    <div class="course-content">
                        <div class="unit-section">
                            <div class="unit-title">Unidad I - 35%</div>
                            <table class="grades-table">
                                <thead>
                                    <tr>
                                        <th>Unidad</th>
                                        <th>Criterio</th>
                                        <th>Peso C.</th>
                                        <th>Peso U.</th>
                                        <th>Nota</th>
                                        <th>Fecha</th>
                                        <th>Descripción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Unidad I</td>
                                        <td>Evaluacion 01</td>
                                        <td>15%</td>
                                        <td>18</td>
                                        <td class="nota-column">18</td>
                                        <td>Sep 15 2025<br>03:30:00:000PM</td>
                                        <td>Laboratorio</td>
                                    </tr>
                                    <tr>
                                        <td>Unidad I</td>
                                        <td>Evaluacion 02</td>
                                        <td>25%</td>
                                        <td>16</td>
                                        <td class="nota-column">16</td>
                                        <td>Sep 22 2025<br>05:45:00:000PM</td>
                                        <td>Proyecto web</td>
                                    </tr>
                                    <tr>
                                        <td>Unidad I</td>
                                        <td>Evaluacion 03</td>
                                        <td>20%</td>
                                        <td>14</td>
                                        <td class="nota-column">14</td>
                                        <td>Sep 28 2025<br>07:20:00:000PM</td>
                                        <td>Práctica calificada</td>
                                    </tr>
                                    <tr>
                                        <td>Unidad I</td>
                                        <td>Evaluacion 04</td>
                                        <td>40%</td>
                                        <td>15</td>
                                        <td class="nota-column">15</td>
                                        <td>Oct 05 2025<br>06:00:00:000PM</td>
                                        <td>Examen parcial</td>
                                    </tr>
                                </tbody>
                            </table>
                            <div class="unit-summary">
                                <span>100%</span>
                                <span>15.55</span>
                            </div>
                        </div>

                        <div class="unit-section">
                            <div class="unit-title">Unidad II - 35%</div>
                            <table class="grades-table">
                                <thead>
                                    <tr>
                                        <th>Unidad</th>
                                        <th>Criterio</th>
                                        <th>Peso C.</th>
                                        <th>Peso U.</th>
                                        <th>Nota</th>
                                        <th>Fecha</th>
                                        <th>Descripción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Unidad II</td>
                                        <td>Evaluacion 01</td>
                                        <td>15%</td>
                                        <td>17</td>
                                        <td class="nota-column">17</td>
                                        <td>Oct 20 2025<br>04:15:00:000PM</td>
                                        <td>API REST</td>
                                    </tr>
                                    <tr>
                                        <td>Unidad II</td>
                                        <td>Evaluacion 02</td>
                                        <td>25%</td>
                                        <td>15</td>
                                        <td class="nota-column">15</td>
                                        <td>Oct 27 2025<br>06:30:00:000PM</td>
                                        <td>Proyecto integrado</td>
                                    </tr>
                                    <tr>
                                        <td>Unidad II</td>
                                        <td>Evaluacion 03</td>
                                        <td>20%</td>
                                        <td>16</td>
                                        <td class="nota-column">16</td>
                                        <td>Nov 03 2025<br>08:00:00:000PM</td>
                                        <td>Trabajo final</td>
                                    </tr>
                                    <tr>
                                        <td>Unidad II</td>
                                        <td>Evaluacion 04</td>
                                        <td>40%</td>
                                        <td>14</td>
                                        <td class="nota-column">14</td>
                                        <td>Nov 10 2025<br>07:00:00:000PM</td>
                                        <td>Examen final</td>
                                    </tr>
                                </tbody>
                            </table>
                            <div class="unit-summary">
                                <span>100%</span>
                                <span>15.20</span>
                            </div>
                        </div>

                        <div class="unit-section">
                            <div class="unit-title">Unidad III - 30%</div>
                            <table class="grades-table">
                                <thead>
                                    <tr>
                                        <th>Unidad</th>
                                        <th>Criterio</th>
                                        <th>Peso C.</th>
                                        <th>Peso U.</th>
                                        <th>Nota</th>
                                        <th>Fecha</th>
                                        <th>Descripción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Unidad III</td>
                                        <td>Evaluacion 01</td>
                                        <td>30%</td>
                                        <td></td>
                                        <td class="nota-column">-</td>
                                        <td></td>
                                        <td>Proyecto final</td>
                                    </tr>
                                    <tr>
                                        <td>Unidad III</td>
                                        <td>Evaluacion 02</td>
                                        <td>30%</td>
                                        <td></td>
                                        <td class="nota-column">-</td>
                                        <td></td>
                                        <td>Sustentación</td>
                                    </tr>
                                    <tr>
                                        <td>Unidad III</td>
                                        <td>Evaluacion 03</td>
                                        <td>40%</td>
                                        <td></td>
                                        <td class="nota-column">-</td>
                                        <td></td>
                                        <td>Portafolio</td>
                                    </tr>
                                </tbody>
                            </table>
                            <div class="unit-summary">
                                <span>100%</span>
                                <span>0.00</span>
                            </div>
                        </div>

                        <div class="course-average">
                            El promedio actual del curso es: <strong>11</strong>
                        </div>
                    </div>
                </div>

                <!-- Curso 3: MACHINE LEARNING -->
                <div class="course-card">
                    <div class="course-header">
                        <span>MACHINE LEARNING</span>
                        <span class="print-icon">🖨️</span>
                    </div>
                    <div class="course-content">
                        <div class="unit-section">
                            <div class="unit-title">Unidad I - 35%</div>
                            <table class="grades-table">
                                <thead>
                                    <tr>
                                        <th>Unidad</th>
                                        <th>Criterio</th>
                                        <th>Peso C.</th>
                                        <th>Peso U.</th>
                                        <th>Nota</th>
                                        <th>Fecha</th>
                                        <th>Descripción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Unidad I</td>
                                        <td>Evaluacion 01</td>
                                        <td>20%</td>
                                        <td>17</td>
                                        <td class="nota-column">17</td>
                                        <td>Sep 12 2025<br>02:15:00:000PM</td>
                                        <td>Algoritmos supervisados</td>
                                    </tr>
                                    <tr>
                                        <td>Unidad I</td>
                                        <td>Evaluacion 02</td>
                                        <td>30%</td>
                                        <td>16</td>
                                        <td class="nota-column">16</td>
                                        <td>Sep 19 2025<br>04:00:00:000PM</td>
                                        <td>Proyecto clasificación</td>
                                    </tr>
                                    <tr>
                                        <td>Unidad I</td>
                                        <td>Evaluacion 03</td>
                                        <td>50%</td>
                                        <td>18</td>
                                        <td class="nota-column">18</td>
                                        <td>Sep 26 2025<br>05:30:00:000PM</td>
                                        <td>Examen teórico-práctico</td>
                                    </tr>
                                </tbody>
                            </table>
                            <div class="unit-summary">
                                <span>100%</span>
                                <span>17.10</span>
                            </div>
                        </div>

                        <div class="unit-section">
                            <div class="unit-title">Unidad II - 35%</div>
                            <table class="grades-table">
                                <thead>
                                    <tr>
                                        <th>Unidad</th>
                                        <th>Criterio</th>
                                        <th>Peso C.</th>
                                        <th>Peso U.</th>
                                        <th>Nota</th>
                                        <th>Fecha</th>
                                        <th>Descripción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Unidad II</td>
                                        <td>Evaluacion 01</td>
                                        <td>20%</td>
                                        <td>15</td>
                                        <td class="nota-column">15</td>
                                        <td>Oct 15 2025<br>03:45:00:000PM</td>
                                        <td>Redes neuronales</td>
                                    </tr>
                                    <tr>
                                        <td>Unidad II</td>
                                        <td>Evaluacion 02</td>
                                        <td>30%</td>
                                        <td>17</td>
                                        <td class="nota-column">17</td>
                                        <td>Oct 22 2025<br>05:15:00:000PM</td>
                                        <td>Deep Learning</td>
                                    </tr>
                                    <tr>
                                        <td>Unidad II</td>
                                        <td>Evaluacion 03</td>
                                        <td>50%</td>
                                        <td>16</td>
                                        <td class="nota-column">16</td>
                                        <td>Oct 29 2025<br>06:45:00:000PM</td>
                                        <td>Proyecto CNN</td>
                                    </tr>
                                </tbody>
                            </table>
                            <div class="unit-summary">
                                <span>100%</span>
                                <span>16.20</span>
                            </div>
                        </div>

                        <div class="unit-section">
                            <div class="unit-title">Unidad III - 30%</div>
                            <table class="grades-table">
                                <thead>
                                    <tr>
                                        <th>Unidad</th>
                                        <th>Criterio</th>
                                        <th>Peso C.</th>
                                        <th>Peso U.</th>
                                        <th>Nota</th>
                                        <th>Fecha</th>
                                        <th>Descripción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Unidad III</td>
                                        <td>Evaluacion 01</td>
                                        <td>40%</td>
                                        <td></td>
                                        <td class="nota-column">-</td>
                                        <td></td>
                                        <td>Proyecto final ML</td>
                                    </tr>
                                    <tr>
                                        <td>Unidad III</td>
                                        <td>Evaluacion 02</td>
                                        <td>30%</td>
                                        <td></td>
                                        <td class="nota-column">-</td>
                                        <td></td>
                                        <td>Paper académico</td>
                                    </tr>
                                    <tr>
                                        <td>Unidad III</td>
                                        <td>Evaluacion 03</td>
                                        <td>30%</td>
                                        <td></td>
                                        <td class="nota-column">-</td>
                                        <td></td>
                                        <td>Exposición final</td>
                                    </tr>
                                </tbody>
                            </table>
                            <div class="unit-summary">
                                <span>100%</span>
                                <span>0.00</span>
                            </div>
                        </div>

                        <div class="course-average">
                            El promedio actual del curso es: <strong>12</strong>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Sección Asistencia -->
            <div id="asistencia" class="section">
                <h2 class="section-title">● Asistencia al curso de TALLER DE TESIS I</h2>
                
                <!-- Asistencia TALLER DE TESIS I -->
                <div class="attendance-section">
                    <div class="attendance-table-container">
                        <table class="attendance-table">
                            <thead>
                                <tr class="date-row">
                                    <th rowspan="2">Fecha</th>
                                    <th>24/11/2025</th>
                                    <th>21/11/2025</th>
                                    <th>14/11/2025</th>
                                    <th>07/11/2025</th>
                                    <th>31/10/2025</th>
                                    <th>24/10/2025</th>
                                    <th>17/10/2025</th>
                                    <th>10/10/2025</th>
                                    <th>03/10/2025</th>
                                    <th>19/09/2025</th>
                                    <th>12/09/2025</th>
                                    <th>05/09/2025</th>
                                </tr>
                                <tr class="day-row">
                                    <th>Lunes</th>
                                    <th>Viernes</th>
                                    <th>Viernes</th>
                                    <th>Viernes</th>
                                    <th>Viernes</th>
                                    <th>Viernes</th>
                                    <th>Viernes</th>
                                    <th>Viernes</th>
                                    <th>Viernes</th>
                                    <th>Viernes</th>
                                    <th>Viernes</th>
                                    <th>Viernes</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><strong>Estado</strong></td>
                                    <td class="status-asiste">Asiste</td>
                                    <td class="status-asiste">Asiste</td>
                                    <td class="status-asiste">Asiste</td>
                                    <td class="status-asiste">Asiste</td>
                                    <td class="status-tardanza">Tardanza</td>
                                    <td class="status-tardanza">Tardanza</td>
                                    <td class="status-tardanza">Tardanza</td>
                                    <td class="status-tardanza">Tardanza</td>
                                    <td class="status-asiste">Asiste</td>
                                    <td class="status-asiste">Asiste</td>
                                    <td class="status-falta">Falta</td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <h2 class="section-title">● Asistencia al curso de PROGRAMACIÓN WEB II</h2>
                
                <!-- Asistencia PROGRAMACIÓN WEB II -->
                <div class="attendance-section">
                    <div class="attendance-table-container">
                        <table class="attendance-table">
                            <thead>
                                <tr class="date-row">
                                    <th rowspan="2">Fecha</th>
                                    <th>24/11/2025</th>
                                    <th>19/11/2025</th>
                                    <th>17/11/2025</th>
                                    <th>12/11/2025</th>
                                    <th>10/11/2025</th>
                                    <th>07/11/2025</th>
                                    <th>05/11/2025</th>
                                    <th>03/11/2025</th>
                                    <th>31/10/2025</th>
                                    <th>29/10/2025</th>
                                    <th>27/10/2025</th>
                                    <th>24/10/2025</th>
                                </tr>
                                <tr class="day-row">
                                    <th>Lunes</th>
                                    <th>Miércoles</th>
                                    <th>Lunes</th>
                                    <th>Miércoles</th>
                                    <th>Lunes</th>
                                    <th>Viernes</th>
                                    <th>Miércoles</th>
                                    <th>Lunes</th>
                                    <th>Viernes</th>
                                    <th>Miércoles</th>
                                    <th>Lunes</th>
                                    <th>Viernes</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><strong>Estado</strong></td>
                                    <td></td>
                                    <td class="status-asiste">Asiste</td>
                                    <td class="status-asiste">Asiste</td>
                                    <td class="status-asiste">Asiste</td>
                                    <td class="status-falta">Falta</td>
                                    <td class="status-asiste">Asiste</td>
                                    <td class="status-falta">Falta</td>
                                    <td class="status-falta">Falta</td>
                                    <td class="status-asiste">Asiste</td>
                                    <td class="status-asiste">Asiste</td>
                                    <td class="status-asiste">Asiste</td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <h2 class="section-title">● Asistencia al curso de CONSTRUCCIÓN DE SOFTWARE I</h2>
                
                <!-- Asistencia CONSTRUCCIÓN DE SOFTWARE I -->
                <div class="attendance-section">
                    <div class="attendance-table-container">
                        <table class="attendance-table">
                            <thead>
                                <tr class="date-row">
                                    <th rowspan="2">Fecha</th>
                                    <th>24/11/2025</th>
                                    <th>19/11/2025</th>
                                    <th>17/11/2025</th>
                                    <th>12/11/2025</th>
                                    <th>10/11/2025</th>
                                    <th>05/11/2025</th>
                                    <th>03/11/2025</th>
                                    <th>29/10/2025</th>
                                    <th>27/10/2025</th>
                                    <th>22/10/2025</th>
                                    <th>20/10/2025</th>
                                    <th>15/10/2025</th>
                                </tr>
                                <tr class="day-row">
                                    <th>Lunes</th>
                                    <th>Miércoles</th>
                                    <th>Lunes</th>
                                    <th>Miércoles</th>
                                    <th>Lunes</th>
                                    <th>Miércoles</th>
                                    <th>Lunes</th>
                                    <th>Miércoles</th>
                                    <th>Lunes</th>
                                    <th>Miércoles</th>
                                    <th>Lunes</th>
                                    <th>Miércoles</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><strong>Estado</strong></td>
                                    <td></td>
                                    <td class="status-asiste">Asiste</td>
                                    <td class="status-asiste">Asiste</td>
                                    <td class="status-asiste">Asiste</td>
                                    <td class="status-asiste">Asiste</td>
                                    <td class="status-asiste">Asiste</td>
                                    <td class="status-asiste">Asiste</td>
                                    <td class="status-asiste">Asiste</td>
                                    <td class="status-asiste">Asiste</td>
                                    <td class="status-asiste">Asiste</td>
                                    <td class="status-asiste">Asiste</td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <h2 class="section-title">● Asistencia al curso de REDES Y COMUNICACIÓN DE DATOS II</h2>
                
                <!-- Asistencia REDES Y COMUNICACIÓN DE DATOS II -->
                <div class="attendance-section">
                    <div class="attendance-table-container">
                        <table class="attendance-table">
                            <thead>
                                <tr class="date-row">
                                    <th rowspan="2">Fecha</th>
                                    <th>24/11/2025</th>
                                    <th>05/12/2025</th>
                                    <th>02/12/2025</th>
                                    <th>28/11/2025</th>
                                    <th>25/11/2025</th>
                                    <th>21/11/2025</th>
                                    <th>14/11/2025</th>
                                    <th>07/11/2025</th>
                                    <th>04/11/2025</th>
                                    <th>31/10/2025</th>
                                    <th>28/10/2025</th>
                                    <th>24/10/2025</th>
                                </tr>
                                <tr class="day-row">
                                    <th>Lunes</th>
                                    <th>Viernes</th>
                                    <th>Martes</th>
                                    <th>Viernes</th>
                                    <th>Martes</th>
                                    <th>Viernes</th>
                                    <th>Viernes</th>
                                    <th>Viernes</th>
                                    <th>Martes</th>
                                    <th>Viernes</th>
                                    <th>Martes</th>
                                    <th>Viernes</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><strong>Estado</strong></td>
                                    <td></td>
                                    <td></td>
                                    <td class="status-asiste">Asiste</td>
                                    <td class="status-asiste">Asiste</td>
                                    <td class="status-asiste">Asiste</td>
                                    <td class="status-asiste">Asiste</td>
                                    <td class="status-asiste">Asiste</td>
                                    <td class="status-asiste">Asiste</td>
                                    <td class="status-asiste">Asiste</td>
                                    <td class="status-asiste">Asiste</td>
                                    <td class="status-asiste">Asiste</td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <h2 class="section-title">● Asistencia al curso de GESTIÓN DE LA CONFIGURACIÓN DE SOFTWARE</h2>
                
                <!-- Asistencia GESTIÓN DE LA CONFIGURACIÓN DE SOFTWARE -->
                <div class="attendance-section">
                    <div class="attendance-table-container">
                        <table class="attendance-table">
                            <thead>
                                <tr class="date-row">
                                    <th rowspan="2">Fecha</th>
                                    <th>24/11/2025</th>
                                    <th>21/11/2025</th>
                                    <th>19/11/2025</th>
                                    <th>14/11/2025</th>
                                    <th>12/11/2025</th>
                                    <th>07/11/2025</th>
                                    <th>05/11/2025</th>
                                    <th>31/10/2025</th>
                                    <th>29/10/2025</th>
                                    <th>24/10/2025</th>
                                    <th>22/10/2025</th>
                                    <th>17/10/2025</th>
                                </tr>
                                <tr class="day-row">
                                    <th>Lunes</th>
                                    <th>Viernes</th>
                                    <th>Miércoles</th>
                                    <th>Viernes</th>
                                    <th>Miércoles</th>
                                    <th>Viernes</th>
                                    <th>Miércoles</th>
                                    <th>Viernes</th>
                                    <th>Miércoles</th>
                                    <th>Viernes</th>
                                    <th>Miércoles</th>
                                    <th>Viernes</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><strong>Estado</strong></td>
                                    <td></td>
                                    <td class="status-tardanza">Tardanza</td>
                                    <td class="status-asiste">Asiste</td>
                                    <td class="status-asiste">Asiste</td>
                                    <td class="status-falta">Falta</td>
                                    <td class="status-asiste">Asiste</td>
                                    <td class="status-asiste">Asiste</td>
                                    <td class="status-asiste">Asiste</td>
                                    <td class="status-asiste">Asiste</td>
                                    <td class="status-asiste">Asiste</td>
                                    <td class="status-asiste">Asiste</td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <h2 class="section-title">● Asistencia al curso de MACHINE LEARNING</h2>
                
                <!-- Asistencia MACHINE LEARNING -->
                <div class="attendance-section">
                    <div class="attendance-table-container">
                        <table class="attendance-table">
                            <thead>
                                <tr class="date-row">
                                    <th rowspan="2">Fecha</th>
                                    <th>20/11/2025</th>
                                    <th>18/11/2025</th>
                                    <th>13/11/2025</th>
                                    <th>11/11/2025</th>
                                    <th>06/11/2025</th>
                                    <th>04/11/2025</th>
                                    <th>30/10/2025</th>
                                    <th>28/10/2025</th>
                                    <th>23/10/2025</th>
                                    <th>21/10/2025</th>
                                    <th>16/10/2025</th>
                                    <th>14/10/2025</th>
                                </tr>
                                <tr class="day-row">
                                    <th>Miércoles</th>
                                    <th>Martes</th>
                                    <th>Miércoles</th>
                                    <th>Martes</th>
                                    <th>Miércoles</th>
                                    <th>Martes</th>
                                    <th>Miércoles</th>
                                    <th>Martes</th>
                                    <th>Miércoles</th>
                                    <th>Martes</th>
                                    <th>Miércoles</th>
                                    <th>Martes</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><strong>Estado</strong></td>
                                    <td class="status-asiste">Asiste</td>
                                    <td class="status-asiste">Asiste</td>
                                    <td class="status-asiste">Asiste</td>
                                    <td class="status-asiste">Asiste</td>
                                    <td class="status-asiste">Asiste</td>
                                    <td class="status-asiste">Asiste</td>
                                    <td class="status-asiste">Asiste</td>
                                    <td class="status-tardanza">Tardanza</td>
                                    <td class="status-asiste">Asiste</td>
                                    <td class="status-asiste">Asiste</td>
                                    <td class="status-asiste">Asiste</td>
                                    <td class="status-asiste">Asiste</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        // Actualizar reloj
        function updateClock() {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            const timeString = `${hours}:${minutes}:${seconds}`;
            document.getElementById('sys-time').textContent = timeString;
        }

        setInterval(updateClock, 1000);
        updateClock();

        // Cambiar entre secciones
        function showSection(sectionName) {
            // Ocultar todas las secciones
            const sections = document.querySelectorAll('.section');
            sections.forEach(section => section.classList.remove('active'));

            // Remover clase active de todas las tabs
            const tabs = document.querySelectorAll('.tab');
            tabs.forEach(tab => tab.classList.remove('active'));

            // Mostrar la sección seleccionada
            const targetSection = document.getElementById(sectionName);
            if (targetSection) {
                targetSection.classList.add('active');
            }

            // Activar la tab correspondiente
            if (event && event.target) {
                event.target.classList.add('active');
            } else {
                // Si se llama programáticamente, buscar y activar la tab
                tabs.forEach(tab => {
                    if (tab.getAttribute('onclick').includes(sectionName)) {
                        tab.classList.add('active');
                    }
                });
            }
        }

        // 🆕 DETECTAR PARÁMETRO URL Y ABRIR SECCIÓN AUTOMÁTICAMENTE
        window.addEventListener('DOMContentLoaded', function() {
            const urlParams = new URLSearchParams(window.location.search);
            const section = urlParams.get('section');
            
            if (section && ['horario', 'notas', 'asistencia'].includes(section)) {
                console.log(`🎯 Abriendo sección: ${section}`);
                showSection(section);
                
                // Scroll suave a la sección
                setTimeout(() => {
                    const sectionElement = document.getElementById(section);
                    if (sectionElement) {
                        sectionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }, 100);
            }
        });

        // Imprimir curso
        document.querySelectorAll('.print-icon').forEach(icon => {
            icon.addEventListener('click', function() {
                window.print();
            });
        });
    </script>
</body>
</html>
