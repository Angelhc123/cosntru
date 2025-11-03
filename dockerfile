# Usa la imagen base oficial de PHP con Apache
FROM php:8.2-apache

# Instala extensiones necesarias
RUN apt-get update && apt-get install -y libzip-dev unzip \
    && docker-php-ext-install pdo pdo_mysql mysqli

# Habilita mod_rewrite de Apache
RUN a2enmod rewrite
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

# Copia los archivos del proyecto al contenedor
COPY . /var/www/html/

# Configura Apache para usar /public como raíz del sitio
RUN sed -i 's#/var/www/html#/var/www/html/public#g' /etc/apache2/sites-available/000-default.conf

# Establece el directorio de trabajo
WORKDIR /var/www/html/public

# Expone el puerto
EXPOSE 80

# Comando de inicio
CMD ["apache2-foreground"]