# Imagen base oficial de PHP con Apache
FROM php:8.2-apache

# Instalar extensiones necesarias para MySQL
RUN apt-get update && apt-get install -y libzip-dev unzip \
    && docker-php-ext-install pdo pdo_mysql mysqli \
    && apt-get clean

# Copiar el código del proyecto
COPY . /var/www/html

# Establecer el directorio de trabajo
WORKDIR /var/www/html

# Exponer puerto dinámico (Railway lo asigna automáticamente)
EXPOSE 8000

# Comando de inicio compatible con Railway
CMD ["sh", "-c", "php -S 0.0.0.0:${PORT:-8000} -t ."]