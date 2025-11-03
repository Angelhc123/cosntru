FROM php:8.2-apache

# Instalar dependencias necesarias y extensiones de PHP
RUN apt-get update && apt-get install -y libzip-dev unzip \
    && docker-php-ext-install pdo pdo_mysql mysqli

# Configurar Apache
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf
RUN a2enmod rewrite

# Copiar todos los archivos del proyecto al contenedor
WORKDIR /var/www/html
COPY . /var/www/html

# Copiar el archivo php.ini personalizado
COPY php.ini /usr/local/etc/php/conf.d/php.ini

# Asignar permisos correctos a los archivos
RUN chown -R www-data:www-data /var/www/html

# Configurar Apache para usar el puerto asignado por Railway ($PORT)
RUN sed -i 's/Listen 80/Listen ${PORT}/' /etc/apache2/ports.conf && \
    sed -i 's/:80/:${PORT}/' /etc/apache2/sites-available/000-default.conf

# Exponer el puerto (Railway ignora el número, pero se deja por compatibilidad)
EXPOSE 8000

# Iniciar Apache en primer plano usando el puerto dinámico
CMD ["sh", "-c", "apache2ctl -D FOREGROUND"]