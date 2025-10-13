#!/usr/bin/env python3
"""
Script para consolidar FD04-PARTE2 en FD04 principal
Inserta todas las secciones faltantes (8, 9, 10, 11) antes de los APÉNDICES
"""

import re

# Leer el archivo principal
with open('/home/desci/Documentos/constru/upt-chat-system/docs/FD04-EPIS-Informe_SAD_ACTUALIZADO_v2.md', 'r', encoding='utf-8') as f:
    main_content = f.read()

# Leer el archivo de la parte 2
with open('/home/desci/Documentos/constru/upt-chat-system/docs/FD04-PARTE2-Diagramas-Complementarios.md', 'r', encoding='utf-8') as f:
    parte2_content = f.read()

# Extraer las secciones 8, 9, 10, 11 de la Parte 2
# La sección 7 ya la insertamos, ahora extraemos desde "## 8. Vista de Despliegue" hasta el final

# Buscar donde empieza la sección 8
match = re.search(r'## 8\. Vista de Despliegue', parte2_content)
if match:
    # Extraer desde la sección 8 hasta el final (sin incluir el pie de página)
    content_to_insert = parte2_content[match.start():]
    
    # Remover el pie de página de la Parte 2
    content_to_insert = re.sub(
        r'\n---\n+\*\*FIN DEL DOCUMENTO FD04.*$',
        '',
        content_to_insert,
        flags=re.DOTALL
    )
    
    # Buscar donde están los APÉNDICES en el documento principal
    apendices_match = re.search(r'\n# APÉNDICES\n', main_content)
    
    if apendices_match:
        # Insertar el contenido justo antes de los APÉNDICES
        new_content = (
            main_content[:apendices_match.start()] + 
            '\n' + content_to_insert + '\n\n---\n' +
            main_content[apendices_match.start():]
        )
        
        # Guardar el archivo consolidado
        with open('/home/desci/Documentos/constru/upt-chat-system/docs/FD04-EPIS-Informe_SAD_ACTUALIZADO_v2.md', 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        print("✅ Documento FD04 consolidado exitosamente!")
        print(f"📊 Tamaño final: {len(new_content.splitlines())} líneas")
        print("📄 Secciones agregadas:")
        print("   - Sección 8: Vista de Despliegue (completa)")
        print("   - Sección 9: Calidad del Software")
        print("   - Sección 10: Decisiones Arquitectónicas")
        print("   - Sección 11: Tamaño y Rendimiento")
    else:
        print("❌ No se encontró la sección APÉNDICES")
else:
    print("❌ No se encontró la sección 8 en Parte 2")
