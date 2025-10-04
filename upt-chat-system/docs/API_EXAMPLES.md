# 💻 EJEMPLOS DE USO - API GATEWAY

## 🔐 **AUTENTICACIÓN JWT**

### **1. Login - Obtener Token**

**Request:**
```bash
curl -X POST http://localhost:3000/api/v1/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "estudiante@upt.edu.pe",
    "password": "password123"
  }'
```

**Response (200):**
```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "estudiante@upt.edu.pe",
    "firstName": "Juan",
    "lastName": "Pérez",
    "userType": "student",
    "isActive": true,
    "createdAt": "2025-10-04T10:00:00.000Z",
    "updatedAt": "2025-10-04T10:00:00.000Z"
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1MDdmMWY3N2JjZjg2Y2Q3OTk0MzkwMTEiLCJlbWFpbCI6ImVzdHVkaWFudGVAdXB0LmVkdS5wZSIsInVzZXJUeXBlIjoic3R1ZGVudCIsImlhdCI6MTY5NjQxNjAwMCwiZXhwIjoxNjk3MDIwODAwfQ.abc123xyz",
  "token_type": "Bearer",
  "expires_in": "7d"
}
```

**Response (401) - Credenciales inválidas:**
```json
{
  "statusCode": 401,
  "timestamp": "2025-10-04T10:30:00.000Z",
  "path": "/api/v1/users/login",
  "method": "POST",
  "message": "Credenciales inválidas. Verifica tu email y contraseña.",
  "error": "Unauthorized"
}
```

---

## 👤 **ENDPOINTS DE USUARIOS**

### **2. Obtener Perfil de Usuario**

**Request:**
```bash
curl -X GET http://localhost:3000/api/v1/users/profile/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response (200):**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "email": "estudiante@upt.edu.pe",
  "firstName": "Juan",
  "lastName": "Pérez",
  "userType": "student",
  "isActive": true,
  "createdAt": "2025-10-04T10:00:00.000Z",
  "updatedAt": "2025-10-04T10:00:00.000Z"
}
```

**Response (401) - Sin token:**
```json
{
  "statusCode": 401,
  "message": "Token no proporcionado. Header requerido: Authorization: Bearer <token>",
  "error": "Unauthorized"
}
```

**Response (404) - Usuario no encontrado:**
```json
{
  "statusCode": 404,
  "timestamp": "2025-10-04T10:30:00.000Z",
  "path": "/api/v1/users/profile/invalid_id",
  "method": "GET",
  "message": "Usuario no encontrado",
  "error": "Not Found"
}
```

### **3. Validar Permisos de Chat**

**Request:**
```bash
curl -X GET http://localhost:3000/api/v1/users/validate-for-chat/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response (200):**
```json
{
  "canChat": true
}
```

### **4. Listar Usuarios por Tipo**

**Request:**
```bash
# Tipos válidos: student, teacher, admin, staff
curl -X GET http://localhost:3000/api/v1/users/by-type/student \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response (200):**
```json
{
  "users": [
    {
      "id": "507f1f77bcf86cd799439011",
      "email": "estudiante1@upt.edu.pe",
      "firstName": "Juan",
      "lastName": "Pérez",
      "userType": "student",
      "isActive": true
    },
    {
      "id": "507f1f77bcf86cd799439012",
      "email": "estudiante2@upt.edu.pe",
      "firstName": "María",
      "lastName": "García",
      "userType": "student",
      "isActive": true
    }
  ],
  "count": 2
}
```

---

## 🏥 **HEALTH CHECKS**

### **5. Health Check Completo**

**Request:**
```bash
curl http://localhost:3000/api/v1/health
```

**Response (200):**
```json
{
  "status": "ok",
  "timestamp": "2025-10-04T10:30:00.000Z",
  "uptime": 3600,
  "environment": "development",
  "version": "1.0.0",
  "database": {
    "status": "connected",
    "type": "MongoDB",
    "responseTime": 15
  },
  "memory": {
    "used": "45.23 MB",
    "total": "128.00 MB",
    "percentage": "35.34%"
  }
}
```

### **6. Health Check Rápido (Ping)**

**Request:**
```bash
curl http://localhost:3000/api/v1/health/ping
```

**Response (200):**
```json
{
  "status": "ok",
  "timestamp": "2025-10-04T10:30:00.000Z"
}
```

### **7. Health Check de Base de Datos**

**Request:**
```bash
curl http://localhost:3000/api/v1/health/database
```

**Response (200):**
```json
{
  "status": "connected",
  "type": "MongoDB",
  "responseTime": 12
}
```

**Response (503) - Base de datos desconectada:**
```json
{
  "status": "disconnected",
  "type": "MongoDB"
}
```

---

## 🔑 **EJEMPLOS CON JAVASCRIPT/TYPESCRIPT**

### **8. Login con Fetch API**

```javascript
async function login(email, password) {
  const response = await fetch('http://localhost:3000/api/v1/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  const data = await response.json();
  
  // Guardar token en localStorage
  localStorage.setItem('access_token', data.access_token);
  localStorage.setItem('user', JSON.stringify(data.user));
  
  return data;
}

// Uso:
try {
  const result = await login('estudiante@upt.edu.pe', 'password123');
  console.log('Login exitoso:', result.user);
} catch (error) {
  console.error('Error en login:', error);
}
```

### **9. Llamada a Endpoint Protegido**

```javascript
async function getUserProfile(userId) {
  const token = localStorage.getItem('access_token');
  
  const response = await fetch(`http://localhost:3000/api/v1/users/profile/${userId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (response.status === 401) {
    // Token expirado o inválido - redirigir a login
    window.location.href = '/login';
    return;
  }

  if (!response.ok) {
    throw new Error('Failed to fetch profile');
  }

  return await response.json();
}

// Uso:
try {
  const profile = await getUserProfile('507f1f77bcf86cd799439011');
  console.log('Perfil:', profile);
} catch (error) {
  console.error('Error:', error);
}
```

### **10. Interceptor para Axios**

```javascript
import axios from 'axios';

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
  timeout: 10000,
});

// Interceptor para agregar token automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado - redirigir a login
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Uso:
// Login
const loginResponse = await api.post('/users/login', {
  email: 'estudiante@upt.edu.pe',
  password: 'password123',
});
localStorage.setItem('access_token', loginResponse.data.access_token);

// Endpoints protegidos (token se agrega automáticamente)
const profile = await api.get('/users/profile/507f1f77bcf86cd799439011');
const users = await api.get('/users/by-type/student');
```

---

## 🧪 **EJEMPLOS DE PRUEBAS (JEST)**

### **11. Test de Login**

```typescript
describe('UsersController - Login', () => {
  it('should return access token on successful login', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/users/login')
      .send({
        email: 'estudiante@upt.edu.pe',
        password: 'password123',
      })
      .expect(200);

    expect(response.body).toHaveProperty('access_token');
    expect(response.body).toHaveProperty('user');
    expect(response.body.token_type).toBe('Bearer');
    expect(response.body.expires_in).toBe('7d');
  });

  it('should return 401 on invalid credentials', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/users/login')
      .send({
        email: 'invalid@upt.edu.pe',
        password: 'wrong_password',
      })
      .expect(401);
  });
});
```

### **12. Test de Endpoint Protegido**

```typescript
describe('UsersController - Protected Endpoints', () => {
  let accessToken: string;

  beforeAll(async () => {
    // Login para obtener token
    const loginResponse = await request(app.getHttpServer())
      .post('/api/v1/users/login')
      .send({
        email: 'estudiante@upt.edu.pe',
        password: 'password123',
      });
    
    accessToken = loginResponse.body.access_token;
  });

  it('should reject request without token', async () => {
    await request(app.getHttpServer())
      .get('/api/v1/users/profile/507f1f77bcf86cd799439011')
      .expect(401);
  });

  it('should accept request with valid token', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/users/profile/507f1f77bcf86cd799439011')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('email');
  });
});
```

---

## 🐍 **EJEMPLOS CON PYTHON**

### **13. Login con requests**

```python
import requests

def login(email, password):
    url = 'http://localhost:3000/api/v1/users/login'
    payload = {
        'email': email,
        'password': password
    }
    
    response = requests.post(url, json=payload)
    
    if response.status_code == 200:
        data = response.json()
        return data['access_token'], data['user']
    else:
        raise Exception(f'Login failed: {response.json()}')

# Uso
token, user = login('estudiante@upt.edu.pe', 'password123')
print(f'Token: {token}')
print(f'User: {user}')
```

### **14. Endpoint Protegido con Python**

```python
import requests

def get_user_profile(user_id, token):
    url = f'http://localhost:3000/api/v1/users/profile/{user_id}'
    headers = {
        'Authorization': f'Bearer {token}'
    }
    
    response = requests.get(url, headers=headers)
    
    if response.status_code == 200:
        return response.json()
    elif response.status_code == 401:
        raise Exception('Token expired or invalid')
    else:
        raise Exception(f'Request failed: {response.json()}')

# Uso
profile = get_user_profile('507f1f77bcf86cd799439011', token)
print(f'Profile: {profile}')
```

---

## 📱 **EJEMPLOS PARA POSTMAN**

### **15. Colección de Postman**

**Variables de entorno:**
```json
{
  "base_url": "http://localhost:3000/api/v1",
  "access_token": ""
}
```

**Request 1: Login**
- **Method:** POST
- **URL:** `{{base_url}}/users/login`
- **Body (JSON):**
```json
{
  "email": "estudiante@upt.edu.pe",
  "password": "password123"
}
```
- **Tests (para guardar token):**
```javascript
if (pm.response.code === 200) {
    const jsonData = pm.response.json();
    pm.environment.set("access_token", jsonData.access_token);
}
```

**Request 2: Get Profile**
- **Method:** GET
- **URL:** `{{base_url}}/users/profile/507f1f77bcf86cd799439011`
- **Headers:**
```
Authorization: Bearer {{access_token}}
```

---

## 🔍 **DEBUGGING**

### **16. Ver Logs en Desarrollo**

```bash
# Los logs aparecen en consola con colores
npm run start:dev

# Output:
[2025-10-04 10:30:15] INFO  [UsersController] Usuario autenticado exitosamente
[2025-10-04 10:30:20] WARN  [UsersController] Intento de login fallido
```

### **17. Ver Logs en Producción**

```bash
# Logs se guardan en archivos JSON
tail -f logs/combined.log | jq '.'

# Filtrar solo errores
grep '"level":"error"' logs/combined.log | jq '.'

# Filtrar por contexto
grep '"context":"UsersController"' logs/combined.log | jq '.'
```

---

## 🎯 **TIPS Y MEJORES PRÁCTICAS**

### **18. Renovar Token Antes de Expirar**

```javascript
function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000; // Convertir a milliseconds
    return Date.now() >= exp;
  } catch {
    return true;
  }
}

function shouldRefreshToken(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000;
    const timeLeft = exp - Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    
    // Renovar si quedan menos de 1 día
    return timeLeft < oneDay;
  } catch {
    return false;
  }
}
```

### **19. Manejo de Errores Robusto**

```javascript
async function apiCall(url, options) {
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Request failed');
    }
    
    return await response.json();
  } catch (error) {
    if (error.message.includes('NetworkError')) {
      console.error('Error de red. Verifica tu conexión.');
    } else if (error.message.includes('401')) {
      console.error('Sesión expirada. Redirigiendo a login...');
      // Redirigir a login
    } else {
      console.error('Error:', error.message);
    }
    throw error;
  }
}
```

---

**Última actualización:** 4 de Octubre, 2025
