FROM php:8.2-apache

RUN apt-get update && apt-get install -y libzip-dev unzip \
    && docker-php-ext-install pdo pdo_mysql mysqli

RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf
RUN a2enmod rewrite

WORKDIR /var/www/html
COPY . /var/www/html
COPY php.ini /usr/local/etc/php/conf.d/php.ini
RUN chown -R www-data:www-data /var/www/html

# 👇 Este comando se ejecuta solo cuando el contenedor inicia (y $PORT ya existe)
CMD bash -c "sed -i 's/Listen 80/Listen ${PORT}/' /etc/apache2/ports.conf && \
    sed -i 's/:80/:${PORT}/' /etc/apache2/sites-available/000-default.conf && \
    apache2-foreground"