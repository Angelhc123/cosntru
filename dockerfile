FROM php:8.2-apache

RUN apt-get update && apt-get install -y libzip-dev unzip \
    && docker-php-ext-install pdo pdo_mysql mysqli

RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf
RUN a2enmod rewrite

# Configurar DocumentRoot correctamente
RUN sed -i 's#/var/www/html#/var/www/html/public#g' /etc/apache2/sites-available/000-default.conf

# Copiar todo el código
COPY . /var/www/html/

# Cambiar permisos (importante)
RUN chown -R www-data:www-data /var/www/html
RUN chmod -R 755 /var/www/html

# Directorio de trabajo
WORKDIR /var/www/html/public
