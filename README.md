# EcoRG

Aplicación web MERN orientada a reciclaje, participación ciudadana y conciencia ambiental en Río Gallegos.

EcoRG fue desarrollada como proyecto final de **Diseño y Programación Web** con el objetivo de ofrecer una plataforma digital que ayude a la ciudadanía a:

- encontrar puntos verdes;
- reportar problemas ambientales;
- consultar información educativa y operativa;
- interactuar con un panel administrativo para moderación y gestión de datos.

## Descripción

EcoRG busca resolver un problema concreto: la falta de una herramienta digital unificada para promover el reciclaje, mejorar la visibilidad de los puntos verdes y facilitar la participación ciudadana en la gestión ambiental local.

La plataforma combina:

- una interfaz pública para usuarios;
- autenticación con JWT;
- reportes comunitarios con imagen y ubicación;
- mapa de puntos verdes con Google Maps;
- panel admin para moderar y gestionar información;
- un sistema inicial de gamificación basado en acciones reales y validadas.

## Objetivo del proyecto

El objetivo general de EcoRG es mejorar la relación entre ciudadanía, reciclaje y gestión ambiental urbana mediante una aplicación web usable, visualmente clara y técnicamente defendible.

En términos de tesis, el proyecto demuestra:

- diseño y desarrollo de una arquitectura MERN completa;
- integración frontend/backend con autenticación y roles;
- manejo de datos georreferenciados;
- subida de imágenes;
- panel administrativo;
- diseño UX/UI orientado a una app ciudadana real.

## MVP defendible para la tesis

Hoy el núcleo defendible de EcoRG es:

- autenticación y gestión de sesión;
- mapa público de puntos verdes;
- reportes comunitarios con moderación;
- panel admin con CRUDs y métricas;
- perfil de usuario;
- gamificación básica con puntos, niveles, acciones eco y badges.

Los módulos `Educación Ambiental` y `Calendario de Recolección` están presentables y útiles para demo, aunque actualmente usan datos locales estructurados. Pueden mostrarse como módulos funcionales de la experiencia pública, con posibilidad de conexión futura a API.

## Funcionalidades principales

### Público

- Home institucional con llamadas a la acción reales.
- Mapa de puntos verdes con Google Maps.
- Filtros por material, barrio y estado.
- Reportes comunitarios con imagen, ubicación y detalle.
- Educación ambiental con cards, filtros y detalle.
- Calendario de recolección por barrio con datos locales estructurados.
- Perfil de usuario.
- Pantalla de gamificación con puntos, nivel, historial y logros.

### Administración

- Dashboard con métricas reales.
- CRUD de usuarios.
- CRUD de barrios.
- CRUD de puntos verdes.
- Moderación de reportes.
- Moderación de acciones eco de gamificación.

## Stack tecnológico

### Frontend

- React 19
- Vite
- React Router
- Tailwind CSS
- Axios
- React Toastify
- React Icons
- Framer Motion

### Backend

- Node.js
- Express
- MongoDB + Mongoose
- JWT
- bcryptjs
- multer
- cors
- morgan

### Integraciones

- Google Maps JavaScript API
- Google Places Autocomplete

## Arquitectura general

```text
Usuario / Admin
        |
        v
Frontend React + Vite
        |
        v
API REST Express
        |
        v
MongoDB (Mongoose)
```

### Frontend

El frontend se encarga de:

- navegación pública y privada;
- formularios y validaciones;
- consumo de endpoints REST;
- visualización de mapa, reportes, gamificación y panel admin.

### Backend

El backend se encarga de:

- autenticación JWT;
- autorización por roles `user/admin`;
- CRUD de entidades;
- moderación de reportes;
- carga de archivos;
- lógica de gamificación;
- persistencia en MongoDB.

## Estructura del proyecto

```text
ecorg/
├─ README.md
├─ frontend/
│  ├─ package.json
│  ├─ index.html
│  ├─ public/
│  └─ src/
│     ├─ api/
│     ├─ assets/
│     ├─ components/
│     ├─ constants/
│     ├─ pages/
│     ├─ state/
│     └─ utils/
└─ server/
   ├─ package.json
   ├─ scripts/
   └─ src/
      ├─ config/
      ├─ controllers/
      ├─ middleware/
      ├─ models/
      ├─ routes/
      └─ services/
```

## Variables de entorno

### Frontend

Archivo sugerido: `frontend/.env`

```env
VITE_API_URL=http://localhost:4000
VITE_GOOGLE_MAPS_API_KEY=TU_API_KEY_DE_GOOGLE_MAPS
```

- `VITE_API_URL`: URL base del backend.
- `VITE_GOOGLE_MAPS_API_KEY`: API key para mapa público y autocompletado de direcciones.

### Backend

Archivo sugerido: `server/.env`

```env
PORT=4000
MONGO_URI=mongodb://127.0.0.1:27017/ecorg
JWT_SECRET=CAMBIAR_ESTE_SECRETO
CORS_ORIGIN=http://localhost:5173,http://localhost:5174
```

- `PORT`: puerto del servidor Express.
- `MONGO_URI`: cadena de conexión a MongoDB local o Atlas.
- `JWT_SECRET`: clave para firma de tokens JWT.
- `CORS_ORIGIN`: lista de orígenes permitidos separada por comas.

## Instalación paso a paso

### 1. Abrir el proyecto

```bash
cd ecorg
```

### 2. Instalar frontend

```bash
cd frontend
npm install
```

### 3. Instalar backend

```bash
cd ../server
npm install
```

### 4. Configurar variables de entorno

Crear:

- `frontend/.env`
- `server/.env`

usando los ejemplos anteriores.

### 5. Ejecutar backend

```bash
cd server
npm run dev
```

### 6. Ejecutar frontend

En otra terminal:

```bash
cd frontend
npm run dev
```

## Comandos de desarrollo

### Frontend

```bash
cd frontend
npm run dev
npm run build
npm run preview
npm run lint
```

### Backend

```bash
cd server
npm run dev
npm start
npm run seed
npm run seed:reset
npm run seed:admin
```

## Seed demo

EcoRG incluye datos demo pensados para una presentación fluida:

- usuario administrador;
- usuarios ciudadanos;
- barrios;
- puntos verdes;
- reportes.

### Ejecutar seed demo

```bash
cd server
npm run seed
```

### Reiniciar solo los datos demo

```bash
cd server
npm run seed:reset
```

## Usuario admin demo

```text
Email: admin@ecorg.com
Password: Admin123
```

## Endpoints principales

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`

### Usuarios

- `GET /api/users/me`
- `PUT /api/users/me`
- `GET /api/users`
- `POST /api/users`
- `PUT /api/users/:id`
- `DELETE /api/users/:id`
- `PUT /api/users/:id/role`

### Reportes

- `GET /api/reports`
- `GET /api/reports/:id`
- `POST /api/reports`
- `PUT /api/reports/:id`
- `DELETE /api/reports/:id`
- `PUT /api/reports/:id/moderation`
- `PUT /api/reports/:id/estado`

### Puntos verdes

- `GET /api/points`
- `GET /api/points/:id`
- `POST /api/points`
- `PUT /api/points/:id`
- `DELETE /api/points/:id`

### Barrios

- `GET /api/barrios`
- `POST /api/barrios`
- `PUT /api/barrios/:id`
- `DELETE /api/barrios/:id`

### Gamificación

- `GET /api/eco-actions/me`
- `GET /api/eco-actions`
- `POST /api/eco-actions`
- `PUT /api/eco-actions/:id/approve`
- `PUT /api/eco-actions/:id/reject`

### Notificaciones

- `GET /api/notifications/me`
- `PUT /api/notifications/:id/read`
- `PUT /api/notifications/read-all`
- `DELETE /api/notifications/:id`

## Roles del sistema

### `user`

Puede:

- registrarse e iniciar sesión;
- editar su perfil;
- crear reportes;
- ver puntos verdes;
- consultar educación, calendario y gamificación;
- ver su progreso, acciones y badges.

### `admin`

Puede además:

- acceder al panel administrativo;
- gestionar usuarios, barrios y puntos verdes;
- moderar reportes;
- moderar acciones eco;
- visualizar métricas del sistema.

## Estado actual del proyecto

### Funcionalidades sólidas

- autenticación y protección de rutas;
- mapa de puntos verdes con datos reales;
- CRUD admin de puntos verdes;
- flujo completo de reportes;
- CRUD admin de barrios;
- CRUD admin de usuarios;
- dashboard admin;
- gamificación con puntos, niveles, historial, badges y moderación admin.

### Funcionalidades presentables con datos locales

- educación ambiental;
- calendario de recolección.

### Estado general

El proyecto se encuentra en una etapa defendible como MVP profesional para tesis, con backend y frontend conectados en los módulos principales.

## Seguridad básica

### Recomendaciones

- No subir archivos `.env` al repositorio.
- No exponer `MONGO_URI` públicamente.
- Usar un `JWT_SECRET` fuerte y distinto al de desarrollo.
- Restringir la API key de Google Maps por dominio, proyecto y servicios habilitados.
- No reutilizar el usuario admin demo en producción.

## Capturas sugeridas

Podés agregar imágenes reales en esta sección antes de subir el proyecto a GitHub o presentarlo.

```text
/docs/screenshots/home.png
/docs/screenshots/mapa.png
/docs/screenshots/reportes.png
/docs/screenshots/admin-dashboard.png
/docs/screenshots/gamificacion.png
```

Ejemplo:

```md
![Home](docs/screenshots/home.png)
![Mapa de puntos verdes](docs/screenshots/mapa.png)
```

## Funcionalidades futuras

- conexión del calendario a backend;
- administración de contenido educativo desde panel admin;
- métricas más avanzadas en dashboard;
- recuperación de contraseña;
- notificaciones configurables;
- gamificación más profunda con ranking y nuevas misiones;
- exportación e importación de datos administrativos.

## Enfoque de tesis

EcoRG puede presentarse como una **plataforma ciudadana ambiental** compuesta por cuatro pilares:

1. acceso a infraestructura de reciclaje mediante puntos verdes;
2. participación comunitaria mediante reportes ambientales;
3. gestión y moderación mediante panel admin;
4. incentivo a la participación mediante gamificación.

Los módulos de educación y calendario complementan esa propuesta y fortalecen la narrativa de producto público integral.

## Notas finales

- Este repositorio no tiene un `package.json` único en la raíz: `frontend` y `server` se ejecutan por separado.
- El backend sirve archivos subidos desde `/uploads`.
- El mapa público depende de Google Maps y del autocompletado de direcciones.

---

**EcoRG**  
Proyecto final de Diseño y Programación Web  
Orientado a reciclaje, participación ciudadana y gestión ambiental en Río Gallegos.
