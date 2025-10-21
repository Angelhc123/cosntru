# Diagramas de Arquitectura - Sistema de Chat UPT

## 📋 Índice de Diagramas

Este directorio contiene los diagramas PlantUML que documentan la arquitectura completa del Sistema de Chat UPT, con especial énfasis en la implementación del RF004 (Recuperación de Contraseña por Email Personal).

### 1. **ARQUITECTURA_SISTEMA.puml**
**Diagrama de Arquitectura de Microservicios**

Muestra la arquitectura completa del sistema con:
- Capa de Presentación (Frontend PHP + Chatbox)
- API Gateway (NestJS)
- Microservicios (NLP Service + Notification Service)
- Servicios Externos (DialogFlow + Gmail)
- Capa de Datos (MongoDB + MySQL)
- Túnel ngrok para HTTPS

**Ideal para:** Entender la estructura general del sistema y las relaciones entre componentes.

### 2. **RF004_SECUENCIA_PASSWORD_RECOVERY.puml**
**Diagrama de Secuencia del Flujo de Recuperación de Contraseña**

Documenta el flujo completo de RF004 en 7 fases:
1. Inicio del flujo ("olvidé mi contraseña")
2. Usuario proporciona email
3. Verificación de email en MySQL
4. Generación de token
5. Envío de email de confirmación
6. Confirmación del usuario
7. Usuario accede con nueva contraseña

**Ideal para:** Entender el flujo temporal de RF004 y las interacciones entre componentes.

### 3. **COMPONENTES_DETALLADOS.puml**
**Diagrama de Componentes Detallado**

Muestra la estructura interna de cada microservicio:
- Frontend Layer: PHP, JavaScript, CSS
- API Gateway: Controllers, Services, DTOs, Repositories
- NLP Service: Controllers, Use Cases, Domain Services, Entities
- Notification Service: Controllers, Services, Templates
- External Services & Databases

**Ideal para:** Desarrolladores que necesitan entender la estructura interna de cada servicio.

### 4. **DEPLOYMENT_INFRASTRUCTURE.puml**
**Diagrama de Despliegue e Infraestructura**

Documenta la infraestructura de deployment:
- Nodos de servidores (Frontend, API Gateway, NLP, Notification)
- Bases de datos en la nube (MongoDB Atlas, CleverCloud MySQL)
- Servicios externos (DialogFlow, Gmail)
- Scripts de gestión (start_all.sh, stop_all.sh, status.sh)
- Configuración (.env files, credentials)

**Ideal para:** DevOps, deployment, y configuración de infraestructura.

## 🛠️ Cómo Visualizar los Diagramas

### Opción 1: PlantUML Online Server (Rápido)
1. Ve a: http://www.plantuml.com/plantuml/uml/
2. Copia y pega el contenido de cualquier archivo `.puml`
3. El diagrama se renderizará automáticamente

### Opción 2: VS Code Extension (Recomendado)
1. Instala la extensión "PlantUML" de jebbs
   ```
   code --install-extension jebbs.plantuml
   ```
2. Instala Java (requerido por PlantUML):
   ```bash
   sudo apt install default-jre
   ```
3. Instala Graphviz:
   ```bash
   sudo apt install graphviz
   ```
4. Abre cualquier archivo `.puml` en VS Code
5. Presiona `Alt + D` para previsualizar el diagrama

### Opción 3: Generar Imágenes PNG/SVG
```bash
# Instalar PlantUML
sudo apt install plantuml

# Generar PNG de un diagrama
plantuml ARQUITECTURA_SISTEMA.puml

# Generar SVG (vectorial, mejor calidad)
plantuml -tsvg ARQUITECTURA_SISTEMA.puml

# Generar todos los diagramas
plantuml *.puml
```

## 📐 Información de los Diagramas

### Colores y Leyendas

Cada diagrama utiliza colores específicos para diferentes capas:
- **LightBlue**: Capa de Presentación
- **LightGreen**: API Gateway
- **LightCyan**: Microservicios
- **LightSalmon**: Capa de Datos
- **LightGray**: Servicios Externos
- **Orange**: Túnel ngrok

### Convenciones

- **Flechas sólidas (→)**: Llamadas síncronas
- **Flechas punteadas (..)**: Configuración o dependencias
- **Rectángulos**: Componentes/Servicios
- **Cilindros**: Bases de datos
- **Nubes**: Servicios externos o en la nube
- **Actores**: Usuarios del sistema

## 🔄 Actualización de Diagramas

Cuando se modifique la arquitectura del sistema, actualiza los diagramas correspondientes:

1. **Nuevos microservicios**: Actualizar `ARQUITECTURA_SISTEMA.puml` y `DEPLOYMENT_INFRASTRUCTURE.puml`
2. **Nuevos flujos**: Crear un nuevo diagrama de secuencia
3. **Nuevos componentes**: Actualizar `COMPONENTES_DETALLADOS.puml`
4. **Cambios de infraestructura**: Actualizar `DEPLOYMENT_INFRASTRUCTURE.puml`

## 📊 Casos de Uso de los Diagramas

### Para Presentaciones
- **ARQUITECTURA_SISTEMA.puml**: Visión general del proyecto
- **RF004_SECUENCIA_PASSWORD_RECOVERY.puml**: Demostración del flujo RF004

### Para Documentación Técnica
- **COMPONENTES_DETALLADOS.puml**: Documentación de código
- **DEPLOYMENT_INFRASTRUCTURE.puml**: Manual de deployment

### Para Nuevos Desarrolladores
1. Empezar con `ARQUITECTURA_SISTEMA.puml` (visión general)
2. Entender `COMPONENTES_DETALLADOS.puml` (estructura interna)
3. Estudiar `RF004_SECUENCIA_PASSWORD_RECOVERY.puml` (flujo específico)
4. Configurar con `DEPLOYMENT_INFRASTRUCTURE.puml` (infraestructura)

## 🔗 Referencias

- [PlantUML Documentation](https://plantuml.com/)
- [PlantUML Cheat Sheet](https://ogom.github.io/draw_uml/plantuml/)
- [Real World PlantUML](https://real-world-plantuml.com/)

## 📝 Notas Importantes

### Información Sensible
Los diagramas contienen información de configuración (emails, credenciales). Asegúrate de:
- No compartir estos archivos públicamente sin sanitizar
- Cambiar las credenciales antes de deployment en producción
- Usar variables de entorno en producción

### Mantenimiento
Estos diagramas deben mantenerse sincronizados con el código. Considera:
- Actualizar diagramas en el mismo PR que los cambios de arquitectura
- Revisar diagramas mensualmente para mantenerlos actualizados
- Archivar versiones antiguas para referencia histórica

## 📧 Contacto

Para preguntas sobre la arquitectura o los diagramas, contactar:
- Equipo de Desarrollo UPT Chat System
- Email: [tu-email@upt.edu.pe]

---

**Última actualización:** 20 de Octubre de 2025  
**Versión del sistema:** 1.0.0  
**RF004 Status:** ✅ Implementado y probado
