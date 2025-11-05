<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gestión de FAQs - UPT</title>
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

        .header {
            background: white;
            padding: 20px 30px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            margin-bottom: 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .header h1 {
            color: #667eea;
            font-size: 28px;
        }

        .btn-back {
            background: #667eea;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            text-decoration: none;
            display: inline-block;
        }

        .btn-back:hover {
            background: #5568d3;
        }

        .content-card {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }

        .table-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }

        .table-header h2 {
            color: #333;
            font-size: 22px;
        }

        .loading {
            text-align: center;
            padding: 40px;
            color: #999;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        thead {
            background: #f8f9fa;
        }

        th {
            padding: 15px;
            text-align: left;
            font-weight: 600;
            color: #666;
            border-bottom: 2px solid #e0e0e0;
        }

        td {
            padding: 15px;
            border-bottom: 1px solid #f0f0f0;
        }

        tr:hover {
            background: #f8f9fa;
        }

        .status-badge {
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            display: inline-block;
        }

        .status-active {
            background: #d4edda;
            color: #155724;
        }

        .status-inactive {
            background: #f8d7da;
            color: #721c24;
        }

        .btn-edit {
            background: #667eea;
            color: white;
            padding: 8px 15px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 13px;
            margin-right: 5px;
        }

        .btn-edit:hover {
            background: #5568d3;
        }

        .btn-save {
            background: #48bb78;
            color: white;
            padding: 8px 15px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 13px;
            margin-right: 5px;
        }

        .btn-save:hover {
            background: #38a169;
        }

        .btn-cancel {
            background: #e53e3e;
            color: white;
            padding: 8px 15px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 13px;
        }

        .btn-cancel:hover {
            background: #c53030;
        }

        .btn-toggle {
            background: none;
            border: none;
            cursor: pointer;
            font-size: 24px;
        }

        input[type="text"], 
        input[type="number"] {
            width: 100%;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 14px;
        }

        .success-message, .error-message {
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
            font-size: 14px;
        }

        .success-message {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }

        .error-message {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }

        .edit-mode {
            background: #fff3cd !important;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div>
                <h1>📋 Gestión de Preguntas Frecuentes</h1>
                <div style="color: #999; font-size: 14px; margin-top: 5px;">
                    Administra las respuestas rápidas del chatbot
                </div>
            </div>
            <a href="admin_dashboard.php" class="btn-back">← Volver al Panel</a>
        </div>

        <div class="content-card">
            <div id="message-container"></div>

            <div class="table-header">
                <h2>Lista de FAQs</h2>
            </div>

            <div id="loading" class="loading">
                <p>⏳ Cargando FAQs...</p>
            </div>

            <div id="faqs-table" style="display: none;">
                <table>
                    <thead>
                        <tr>
                            <th style="width: 50px;">Orden</th>
                            <th>Nombre (Pregunta)</th>
                            <th>Texto del Chat</th>
                            <th style="width: 100px;">Estado</th>
                            <th style="width: 150px;">Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="faqs-tbody">
                        <!-- FAQs se cargarán aquí -->
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <script src="js/config.js"></script>
    <script>
        const API_URL = API_BASE_URL; // Usar configuración centralizada
        let editingRow = null;

        // Cargar FAQs al iniciar
        document.addEventListener('DOMContentLoaded', loadFaqs);

        async function loadFaqs() {
            try {
                console.log('🔍 Cargando FAQs desde:', `${API_URL}/faqs`);
                const response = await fetch(`${API_URL}/faqs`);
                const data = await response.json();
                
                console.log('📊 Respuesta completa del API:', data);
                console.log('📋 Datos de FAQs:', data.data);
                console.log('📈 Cantidad de FAQs:', data.data ? data.data.length : 'undefined');

                if (data.status === 'success') {
                    if (data.data && data.data.length > 0) {
                        renderFaqs(data.data);
                        document.getElementById('loading').style.display = 'none';
                        document.getElementById('faqs-table').style.display = 'block';
                        console.log('✅ FAQs renderizadas exitosamente');
                    } else {
                        console.log('⚠️ No hay FAQs en la respuesta');
                        document.getElementById('loading').innerHTML = '<p>📭 No hay FAQs configuradas</p>';
                        document.getElementById('faqs-table').style.display = 'none';
                    }
                } else {
                    console.error('❌ Error en respuesta del API:', data.message);
                    showError('Error al cargar FAQs: ' + (data.message || 'Error desconocido'));
                }
            } catch (error) {
                console.error('💥 Error de conexión:', error);
                showError('Error de conexión con el servidor');
            }
        }

        function renderFaqs(faqs) {
            const tbody = document.getElementById('faqs-tbody');
            tbody.innerHTML = '';

            faqs.forEach(faq => {
                const row = document.createElement('tr');
                row.id = `row-${faq.id}`;
                row.innerHTML = `
                    <td>${faq.orden}</td>
                    <td>
                        <span class="display-mode">${faq.nombre}</span>
                        <input type="text" class="edit-mode" value="${faq.nombre}" style="display: none;">
                    </td>
                    <td>
                        <span class="display-mode">${faq.texto_chat}</span>
                        <input type="text" class="edit-mode" value="${faq.texto_chat}" style="display: none;">
                    </td>
                    <td>
                        <button class="btn-toggle" onclick="toggleStatus('${faq.id}', ${faq.activo})">
                            ${faq.activo ? '✅' : '❌'}
                        </button>
                    </td>
                    <td>
                        <button class="btn-edit display-mode" onclick="editFaq('${faq.id}')">
                            ✏️ Editar
                        </button>
                        <button class="btn-save edit-mode" onclick="saveFaq('${faq.id}')" style="display: none;">
                            💾 Guardar
                        </button>
                        <button class="btn-cancel edit-mode" onclick="cancelEdit('${faq.id}')" style="display: none;">
                            ❌ Cancelar
                        </button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        }

        function editFaq(id) {
            // Si hay otra fila en edición, cancelarla
            if (editingRow && editingRow !== id) {
                cancelEdit(editingRow);
            }

            const row = document.getElementById(`row-${id}`);
            row.classList.add('edit-mode');
            
            // Ocultar modo display y mostrar modo edit
            row.querySelectorAll('.display-mode').forEach(el => el.style.display = 'none');
            row.querySelectorAll('.edit-mode').forEach(el => el.style.display = 'inline-block');

            editingRow = id;
        }

        function cancelEdit(id) {
            const row = document.getElementById(`row-${id}`);
            row.classList.remove('edit-mode');
            
            // Mostrar modo display y ocultar modo edit
            row.querySelectorAll('.display-mode').forEach(el => el.style.display = '');
            row.querySelectorAll('.edit-mode').forEach(el => el.style.display = 'none');

            // Recargar FAQs para restaurar valores originales
            loadFaqs();
            editingRow = null;
        }

        async function saveFaq(id) {
            const row = document.getElementById(`row-${id}`);
            const inputs = row.querySelectorAll('.edit-mode');
            
            const nombre = inputs[0].value.trim();
            const texto_chat = inputs[1].value.trim();

            if (!nombre || !texto_chat) {
                showError('El nombre y el texto del chat son obligatorios');
                return;
            }

            try {
                const response = await fetch(`${API_URL}/faqs/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ nombre, texto_chat })
                });

                const data = await response.json();

                if (data.status === 'success') {
                    showSuccess('FAQ actualizada exitosamente');
                    loadFaqs();
                    editingRow = null;
                } else {
                    showError(data.message || 'Error al actualizar FAQ');
                }
            } catch (error) {
                console.error('Error:', error);
                showError('Error de conexión con el servidor');
            }
        }

        async function toggleStatus(id, currentStatus) {
            try {
                const response = await fetch(`${API_URL}/faqs/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ activo: !currentStatus })
                });

                const data = await response.json();

                if (data.status === 'success') {
                    showSuccess(`FAQ ${!currentStatus ? 'activada' : 'desactivada'} exitosamente`);
                    loadFaqs();
                } else {
                    showError(data.message || 'Error al cambiar estado');
                }
            } catch (error) {
                console.error('Error:', error);
                showError('Error de conexión con el servidor');
            }
        }

        function showSuccess(message) {
            const container = document.getElementById('message-container');
            container.innerHTML = `<div class="success-message">✅ ${message}</div>`;
            setTimeout(() => container.innerHTML = '', 5000);
        }

        function showError(message) {
            const container = document.getElementById('message-container');
            container.innerHTML = `<div class="error-message">❌ ${message}</div>`;
            setTimeout(() => container.innerHTML = '', 5000);
        }
    </script>

    <!-- CHATBOX WIDGET -->
    <link rel="stylesheet" href="css/chatbox.css">
    <script src="js/chatbox.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const chatbox = new ChatboxWidget();
            chatbox.init();
        });
    </script>
</body>
</html>
