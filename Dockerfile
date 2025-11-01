FROM dunglas/frankenphp:php8.4.14-bookworm

# Instalar extensiones PHP necesarias para MySQL
RUN apt-get update && apt-get install -y \
    libpq-dev \
    libzip-dev \
    unzip \
    && docker-php-ext-install pdo pdo_mysql mysqli

# Copiar configuración personalizada de PHP
COPY php.ini /usr/local/etc/php/conf.d/php.ini

# Configurar el directorio de trabajo
WORKDIR /app

# Copiar archivos del proyecto
COPY . /app

# Exponer puerto
EXPOSE 80

# Comando para iniciar FrankenPHP
CMD ["frankenphp", "run", "--config", "/etc/caddy/Caddyfile"]
