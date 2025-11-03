# Usa la imagen base oficial de PHP con Apache
FROM php:8.2-apache

# Instala extensiones necesarias
RUN apt-get update && apt-get install -y libzip-dev unzip \
    && docker-php-ext-install pdo pdo_mysql mysqli \
    && rm -rf /var/lib/apt/lists/*

# Habilita mod_rewrite de Apache
RUN a2enmod rewrite
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

# Copia los archivos del proyecto al contenedor
COPY . /var/www/html/

# Configura el directorio de trabajo
WORKDIR /var/www/html/public

# Asigna permisos adecuados
RUN chown -R www-data:www-data /var/www/html

# Expone el puerto de Apache
EXPOSE 80