# TODO - Corrección Deploy Railway

## Cambios Realizados
- [x] Simplificar nixpacks.toml para solo PHP (Railway detectará automáticamente)
- [x] Revertir omisión del Analytics Service (está implementado)
- [x] Actualizar versiones de dependencias en package.json de todos los servicios
- [x] Actualizar versiones en requirements.txt del NLP Service
- [x] Actualizar Dockerfiles para usar Node.js 20 y Python 3.11
- [x] Cambiar start_railway.sh para ejecutar setup y servicios en background, PHP como principal

## Problemas Identificados y Solucionados
- Versiones incompatibles de Node.js causando warnings en build
- Servicio Analytics SÍ está implementado (tenía lógica completa)
- Versiones desactualizadas de dependencias causando conflictos
- Múltiples procesos en background sin proceso principal claro para Railway
- Railway espera un proceso web principal que escuche en $PORT

## Nueva Arquitectura Simplificada para Railway
- **Servicio Principal**: Solo Frontend PHP (escucha en $PORT)
- **Servicios Separados**: Cada microservicio en su propio servicio Railway
- **Ventajas**: Mejor escalabilidad, debugging, y compatibilidad con Railway

## Servicios a Crear por Separado
- 🔄 API Gateway Service (NestJS/Node.js)
- 🔄 Analytics Service (NestJS/Node.js) - IMPLEMENTADO
- 🔄 Notification Service (NestJS/Node.js)
- 🔄 NLP Service (FastAPI/Python)

## Próximos Pasos
- [ ] Probar deploy del Frontend PHP en Railway
- [ ] Crear servicios separados para cada microservicio
- [ ] Configurar variables de entorno para comunicación entre servicios
- [ ] Actualizar frontend para usar URLs de servicios separados
- [ ] Probar integración completa

## Estado Actual
- ✅ Frontend PHP - Listo para deploy simplificado
- ⏳ Servicios - Requieren configuración por separado
