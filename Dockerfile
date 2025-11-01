# Imagen base oficial de PHP con Apache
FROM php:8.2-apache

# Instalar extensiones necesarias para MySQL y utilidades básicas
RUN docker-php-ext-install pdo pdo_mysql mysqli

# Copiar los archivos del proyecto al contenedor
COPY . /var/www/html

# Establecer el directorio de trabajo
WORKDIR /var/www/html

# Exponer el puerto (Railway asigna uno dinámico)
EXPOSE 8000

# Comando de inicio — usa el puerto dinámico $PORT de Railway
CMD ["sh", "-c", "php -S 0.0.0.0:${PORT:-8000} -t ."]