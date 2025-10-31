function addToCode(value) {
    const codeInput = document.getElementById('codigo');
    if (codeInput.value.length < 10) {
        codeInput.value += value;
    }
}

function clearCode() {
    document.getElementById('codigo').value = '';
}

// Captcha fijo - no necesita generación dinámica
// El captcha siempre es: 5 + 3 = 8

// Función para mostrar ayuda del captcha
function showCaptchaHelp() {
    alert('El captcha es simple: 5 + 3 = 8\nSolo ingresa el número 8 en el campo.');
}

// Función para mostrar/ocultar secciones del dashboard
function showSection(sectionName) {
    // Ocultar todas las secciones
    const sections = document.querySelectorAll('.dashboard-section');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    
    // Mostrar la sección seleccionada
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.style.display = 'block';
    }
    
    // Actualizar tabs activos
    const tabs = document.querySelectorAll('.nav-tab');
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });
    
    const activeTab = document.querySelector(`[onclick="showSection('${sectionName}')"]`).parentElement;
    activeTab.classList.add('active');
}