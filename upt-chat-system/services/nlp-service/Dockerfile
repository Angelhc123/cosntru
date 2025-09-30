# NLP Service Dockerfile  
# Estado: PENDIENTE DE IMPLEMENTACIÓN

FROM python:3.11-slim

WORKDIR /usr/src/app

# Placeholder - será implementado cuando se desarrolle el servicio
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt || echo "requirements.txt no existe aún"

COPY . .

EXPOSE 3002

# Comando temporal hasta implementación real
CMD ["echo", "NLP Service - Pendiente de implementación"]