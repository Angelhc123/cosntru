# Usa la imagen base oficial de PHP con Apache
FROM php:8.2-apache

# Instala extensiones necesarias
RUN apt-get update && apt-get install -y libzip-dev unzip \
    && docker-php-ext-install pdo pdo_mysql mysqli

# Habilita mod_rewrite y configura Apache
RUN a2enmod rewrite
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

# Cambia el DocumentRoot para servir desde /public
RUN sed -i 's#/var/www/html#/var/www/html/public#g' /etc/apache2/sites-available/000-default.conf

# Copia los archivos del proyecto al contenedor
COPY . /var/www/html/

# Establece el directorio de trabajo
WORKDIR /var/www/html/public

# Asigna permisos a Apache
RUN chown -R www-data:www-data /var/www/html

# Expone el puerto por defecto de Apache
EXPOSE 80

# Inicia Apache
CMD ["apache2-foreground"]