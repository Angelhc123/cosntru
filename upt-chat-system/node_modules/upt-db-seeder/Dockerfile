# Usar imagen oficial de Node.js
FROM node:18-alpine

# Crear directorio de trabajo
WORKDIR /usr/src/app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production && npm cache clean --force

# Copiar código fuente
COPY src/ ./src/

# Crear usuario no root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S dbseeder -u 1001

# Cambiar propietario de archivos
RUN chown -R dbseeder:nodejs /usr/src/app

# Cambiar a usuario no root
USER dbseeder

# Exponer puerto
EXPOSE 3001

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Comando para ejecutar la aplicación
CMD ["npm", "start"]