# Guía de Implementación RF004 - Validación por Correo Personal

## ✅ COMPLETADO - Fase 1: NLP Service (Python)

### Archivos creados:
1. ✅ `application/detectors/sensitive_query_detector.py` - Detector de consultas sensibles
2. ✅ `infrastructure/clients/api_gateway_client.py` - Cliente HTTP para API Gateway

### Archivos modificados:
1. ✅ `application/dtos/process_request_dto.py` - Agregado `validation_state` y `pending_category`
2. ✅ `application/dtos/nlp_response_dto.py` - Agregado `requires_validation`, `validation_state`, `validation_message`
3. ✅ `application/use_cases/process_message_use_case.py` - Agregada lógica completa de validación

### Dependencias instaladas:
- ✅ `httpx` - Cliente HTTP asíncrono

---

## ✅ COMPLETADO - Fase 2: API Gateway (NestJS)

### Archivos creados:
1. ✅ `infrastructure/controllers/password-reset.controller.ts` - Controlador de password reset
2. ✅ `infrastructure/dtos/password-reset.dto.ts` - DTOs para password reset
3. ✅ `infrastructure/services/mysql-connection.service.ts` - Servicio de conexión MySQL
4. ✅ `infrastructure/services/password-reset.service.ts` - Lógica de negocio password reset
5. ✅ `infrastructure/services/email.service.ts` - Servicio de envío de emails
6. ✅ `infrastructure/database/schemas/password-reset.schema.ts` - Schemas MongoDB

### Archivos modificados:
1. ✅ `presentation/controllers/users.controller.ts` - Agregado endpoint `verify-email`

### Dependencias instaladas:
- ✅ `mysql2` - Cliente MySQL
- ✅ `nodemailer` y `@types/nodemailer` - Envío de emails
- ✅ `class-validator` y `class-transformer` - Validación DTOs

### Variables de entorno agregadas (.env):
```bash
# MySQL Configuration (proyectotest - simulación UPT)
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DATABASE=upt_intranet

# Gmail SMTP (para RF004 - envío de emails)
GMAIL_USER=angelxhernandezxcruz@gmail.com
GMAIL_APP_PASSWORD=tu_app_password_aqui

# API Gateway URL (para links en emails)
API_GATEWAY_URL=http://localhost:3000
```

---

## 🔧 PENDIENTE - Fase 3: Configuración e Integración

### Paso 1: Configurar Gmail App Password

Para enviar emails necesitas crear un "App Password" de Gmail:

1. Ve a tu cuenta de Google: https://myaccount.google.com/
2. Seguridad → Verificación en 2 pasos (debes activarla si no la tienes)
3. Busca "Contraseñas de aplicaciones"
4. Genera una nueva para "Correo" / "Otra (personalizada)"
5. Copia el código de 16 dígitos
6. Actualiza `.env` en `api-gateway`:
   ```bash
   GMAIL_APP_PASSWORD=abcd efgh ijkl mnop  # (quita los espacios)
   ```

### Paso 2: Configurar MySQL (proyectotest)

1. Asegúrate de que MySQL esté corriendo:
   ```bash
   sudo systemctl status mysql
   ```

2. Verifica credenciales en `.env`:
   ```bash
   MYSQL_HOST=localhost
   MYSQL_PORT=3306
   MYSQL_USER=root
   MYSQL_PASSWORD=tu_password_mysql
   MYSQL_DATABASE=upt_intranet
   ```

3. Verifica que la base de datos exista:
   ```bash
   cd /home/desci/Documentos/constru/proyectotest
   mysql -u root -p < database_setup.sql
   ```

### Paso 3: Registrar servicios en módulos de NestJS

Edita `src/app.module.ts` en `api-gateway` para registrar los nuevos servicios:

```typescript
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MySQLConnectionService } from './infrastructure/services/mysql-connection.service';
import { EmailService } from './infrastructure/services/email.service';
import { PasswordResetService } from './infrastructure/services/password-reset.service';
import { PasswordResetController } from './infrastructure/controllers/password-reset.controller';
import { 
  PasswordResetToken, 
  ValidationNotification 
} from './infrastructure/database/schemas/password-reset.schema';

@Module({
  imports: [
    // ... otras importaciones existentes
    
    MongooseModule.forFeature([
      { name: 'PasswordResetToken', schema: PasswordResetToken.schema },
      { name: 'ValidationNotification', schema: ValidationNotification.schema },
    ]),
  ],
  controllers: [
    // ... otros controladores existentes
    PasswordResetController,
  ],
  providers: [
    // ... otros proveedores existentes
    MySQLConnectionService,
    EmailService,
    PasswordResetService,
  ],
  exports: [
    MySQLConnectionService, // Para usar en UsersController
  ],
})
export class AppModule {}
```

### Paso 4: Inyectar MySQLConnectionService en UsersController

Edita `presentation/controllers/users.controller.ts`:

```typescript
import { MySQLConnectionService } from '../../infrastructure/services/mysql-connection.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly getUserProfileUseCase: GetUserProfileUseCase,
    private readonly validateUserForChatUseCase: ValidateUserForChatUseCase,
    private readonly logger: AppLoggerService,
    private readonly mysqlService: MySQLConnectionService, // ← Cambiar 'any' por tipo correcto
  ) {
    this.logger.setContext('UsersController');
  }
  
  // ... resto del código
}
```

---

## 🔧 PENDIENTE - Fase 4: Frontend (Chatbox)

### Archivo a modificar: `frontend/chatbox.js` (o similar)

Necesitas agregar:

1. **Manejo de estados de validación**:
   ```javascript
   let validationState = null; // 'awaiting_email', 'awaiting_confirmation', 'validated'
   let pendingCategory = null;
   ```

2. **UI especial para captura de email**:
   ```javascript
   if (response.requires_validation && response.validation_state === 'awaiting_email') {
     showEmailInputUI();
   }
   ```

3. **Polling para notificaciones** (cuando está en awaiting_confirmation):
   ```javascript
   const pollInterval = setInterval(async () => {
     const status = await fetch(`/api/password-reset/status/${sessionId}`);
     if (status.confirmed) {
       displayBotMessage("¡Tu contraseña ha sido actualizada!");
       clearInterval(pollInterval);
     }
   }, 5000); // cada 5 segundos
   ```

4. **CSS para email input**:
   ```css
   .email-input-container {
     background: #f0f8ff;
     padding: 15px;
     border-radius: 8px;
     margin: 10px 0;
   }
   ```

---

## 🧪 PENDIENTE - Fase 5: Testing

### Test End-to-End (E2E):

1. **Iniciar servicios**:
   ```bash
   # Terminal 1: NLP Service
   cd services/nlp-service
   python3 main.py
   
   # Terminal 2: API Gateway
   cd services/api-gateway
   npm run start:dev
   
   # Terminal 3: MySQL (proyectotest)
   cd proyectotest
   php -S localhost:8000
   ```

2. **Probar flujo completo**:
   - Usuario escribe: "olvidé mi contraseña"
   - Bot responde: "proporciona tu email"
   - Usuario escribe: "demo@example.com"
   - Bot envía email de confirmación
   - Usuario hace clic en enlace del email
   - Sistema genera nueva contraseña
   - Bot notifica: "Tu nueva contraseña ha sido enviada"

3. **Verificar en MySQL**:
   ```bash
   mysql -u root -p
   USE upt_intranet;
   SELECT * FROM usuarios WHERE email = 'demo@example.com';
   ```

4. **Verificar en MongoDB**:
   ```bash
   mongosh "mongodb+srv://..."
   use upt_chat_system
   db.password_reset_tokens.find()
   db.validation_notifications.find()
   ```

### Casos de error a probar:

- ✅ Email inválido (formato incorrecto)
- ✅ Email no existe en BD
- ✅ Token expirado (después de 1 hora)
- ✅ Token ya usado
- ✅ Error de conexión SMTP
- ✅ Error de conexión MySQL

---

## 📋 Checklist de Implementación

### Backend:
- [x] Detector de consultas sensibles (Python)
- [x] Cliente API Gateway (Python)
- [x] DTOs actualizados (Python)
- [x] Use case modificado (Python)
- [x] Controlador password reset (NestJS)
- [x] Servicio MySQL (NestJS)
- [x] Servicio Email (NestJS)
- [x] Servicio password reset (NestJS)
- [x] Schemas MongoDB (NestJS)
- [x] Endpoint verify-email (NestJS)
- [ ] Registrar servicios en app.module.ts
- [ ] Inyectar MySQLConnectionService correctamente
- [ ] Configurar Gmail App Password
- [ ] Probar conexión MySQL

### Frontend:
- [ ] Manejo de estados de validación
- [ ] UI especial para email input
- [ ] Polling de notificaciones
- [ ] CSS para estados de validación
- [ ] Manejo de errores
- [ ] Feedback visual al usuario

### Testing:
- [ ] Test flujo completo password reset
- [ ] Test email inválido
- [ ] Test email no existe
- [ ] Test token expirado
- [ ] Test notificaciones en tiempo real
- [ ] Test logs en MySQL

### Documentación:
- [ ] Actualizar README con RF004
- [ ] Documentar configuración Gmail
- [ ] Documentar configuración MySQL
- [ ] Agregar ejemplos de uso

---

## 🚀 Comandos Rápidos

### Iniciar todos los servicios:

```bash
# Terminal 1: MySQL
sudo systemctl start mysql

# Terminal 2: NLP Service
cd /home/desci/Documentos/constru/upt-chat-system/services/nlp-service
python3 main.py

# Terminal 3: API Gateway
cd /home/desci/Documentos/constru/upt-chat-system/services/api-gateway
npm run start:dev

# Terminal 4: Frontend (si aplica)
cd /home/desci/Documentos/constru/upt-chat-system/frontend
npm run dev
```

### Ver logs:

```bash
# NLP Service logs
tail -f /home/desci/Documentos/constru/upt-chat-system/services/nlp-service/logs/nlp-service.log

# API Gateway logs (en consola)
# MySQL logs
sudo tail -f /var/log/mysql/error.log
```

---

## 🎯 Próximos Pasos Inmediatos

1. **Configurar Gmail App Password** (5 min)
2. **Registrar servicios en app.module.ts** (10 min)
3. **Probar conexión MySQL** (5 min)
4. **Ejecutar test E2E manual** (20 min)
5. **Implementar UI frontend** (1-2 horas)

---

## 📞 Soporte

Si encuentras algún error, revisa:
1. Logs del NLP Service
2. Consola del API Gateway
3. Estado de MySQL: `sudo systemctl status mysql`
4. Variables de entorno en ambos `.env`
5. Colecciones MongoDB en MongoDB Compass

**¡Implementación RF004 lista al 80%!** 🎉

Falta: Configuración final + Testing + Frontend
