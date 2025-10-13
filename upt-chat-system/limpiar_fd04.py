#!/usr/bin/env python3
"""
Script para limpiar y organizar el documento FD04 consolidado
Elimina secciones duplicadas y reorganiza correctamente
"""

import re

print("📖 Leyendo documento...")
with open('/home/desci/Documentos/constru/upt-chat-system/docs/FD04-EPIS-Informe_SAD_ACTUALIZADO_v2.md', 'r', encoding='utf-8') as f:
    content = f.read()

print("🔍 Identificando secciones...")

# Encontrar donde empieza la Sección 7 (Vista de Procesos) que agregamos
section_7_match = re.search(r'\n# 7\. Vista de Procesos\n', content)

if section_7_match:
    # Guardar todo hasta antes de la Sección 7 duplicada
    content_before = content[:section_7_match.start()]
    
    # Guardar desde la Sección 7 hasta el final
    content_from_7 = content[section_7_match.start():]
    
    # Buscar donde están los APÉNDICES en la nueva parte
    apendices_match = re.search(r'\n# APÉNDICES\n', content_from_7)
    
    if apendices_match:
        # Extraer desde Sección 7 hasta antes de APÉNDICES
        new_sections = content_from_7[:apendices_match.start()]
        
        # Extraer los APÉNDICES
        appendices = content_from_7[apendices_match.start():]
        
        # Eliminar las secciones viejas (4-10) que están antes de la Sección 7
        # Buscar donde termina la Sección 3
        section_3_end = re.search(r'(# 4\.|## 3\.3\.)', content_before)
        
        if section_3_end:
            # Buscar la línea que dice "# 4. Vista de Casos de Uso"
            section_4_match = re.search(r'\n# 4\. Vista de Casos de Uso\n', content_before)
            
            if section_4_match:
                # Guardar desde el inicio hasta Sección 6 (incluida)
                section_6_end = re.search(r'\n(?=# 4\. Atributos de Calidad)', content_before)
                
                if section_6_end:
                    clean_content = content_before[:section_6_end.start()]
                else:
                    clean_content = content_before
                
                # Reconstruir el documento
                final_content = clean_content + '\n\n---\n' + new_sections + '\n\n---\n' + appendices
                
                # Guardar el documento limpio
                with open('/home/desci/Documentos/constru/upt-chat-system/docs/FD04-EPIS-Informe_SAD_ACTUALIZADO_v2.md', 'w', encoding='utf-8') as f:
                    f.write(final_content)
                
                print("✅ Documento limpiado y reorganizado!")
                print(f"📊 Tamaño final: {len(final_content.splitlines())} líneas")
                
                # Contar secciones principales
                sections = re.findall(r'^# \d+\.', final_content, re.MULTILINE)
                print(f"📋 Secciones principales: {len(sections)}")
                print(f"   Secciones encontradas: {sections}")
            else:
                print("❌ No se encontró Sección 4")
        else:
            print("❌ No se encontró el final de Sección 3")
    else:
        print("❌ No se encontraron los APÉNDICES en la nueva parte")
else:
    print("❌ No se encontró la Sección 7")
