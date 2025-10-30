# Variables de Entorno para Railway

Configura estas variables en Railway Dashboard > Variables:

## Base de Datos MySQL (Clever Cloud)
```
MYSQL_ADDON_HOST=bj7lnbakskgcgngpmtma-mysql.services.clever-cloud.com
MYSQL_ADDON_DB=bj7lnbakskgcgngpmtma
MYSQL_ADDON_USER=u7imxhdxstbw6uuy
MYSQL_ADDON_PORT=3306
MYSQL_ADDON_PASSWORD=uaBOXOPi5TD9PEpIy8Uc
```

## MongoDB (Railway Addon)
```
MONGODB_URI=${{MONGO_URL}}
```

## Configuración General
```
NODE_ENV=production
APP_ENV=production
PORT=8000
CORS_ORIGIN=*
JWT_SECRET=upt-chat-system-jwt-secret-2024
```

## Dialogflow
```
DIALOGFLOW_PROJECT_ID=upt-chat-fhps
DIALOGFLOW_LANGUAGE_CODE=es-ES
```

## Pasos:
1. En Railway: Agrega MongoDB addon
2. Copia y pega todas estas variables
3. Deploy automático se activará
