FROM php:8.2-apache

# Instalar extensiones PHP necesarias
RUN apt-get update && apt-get install -y \
    libzip-dev \
    unzip \
    && docker-php-ext-install pdo pdo_mysql mysqli \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Configurar Apache
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

# Habilitar mod_rewrite
RUN a2enmod rewrite

# Configurar DocumentRoot a /var/www/html/public
RUN sed -i 's#/var/www/html#/var/www/html/public#g' /etc/apache2/sites-available/000-default.conf

# Permitir .htaccess override
RUN sed -i '/<Directory \/var\/www\/>/,/<\/Directory>/ s/AllowOverride None/AllowOverride All/' /etc/apache2/apache2.conf

# Copiar código de la aplicación
COPY . /var/www/html/

# Configurar permisos
RUN chown -R www-data:www-data /var/www/html && \
    chmod -R 755 /var/www/html

# Directorio de trabajo
WORKDIR /var/www/html/public

# Exponer puerto (Railway lo asigna dinámicamente)
EXPOSE 8000

# Comando de inicio
CMD ["apache2-foreground"]
