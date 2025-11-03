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

# Exponer el puerto del servidor Apache
EXPOSE 80

# Iniciar Apache en primer plano
CMD ["apache2ctl", "-D", "FOREGROUND"]