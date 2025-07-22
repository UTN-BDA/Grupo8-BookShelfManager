# BookShelfManager: Plataforma Integral de Gestión de Libros

## Descripción del Proyecto

BookShelfManager es una plataforma web para gestionar, descubrir y disfrutar libros. Permite a los usuarios crear estanterías personales, agregar libros desde una base global, y organizar su colección. El sistema está dirigido tanto a lectores casuales como a bibliófilos, e incluye funcionalidades de gestión de colecciones, reseñas y portadas personalizadas.

Actualmente, el MVP se enfoca en la **gestión básica de la colección personal** y la organización de libros en estanterías.

## Módulos Principales del MVP

- **Gestión de Estanterías:** Crea, edita y elimina estanterías personales.
- **Gestión de Libros:** Agrega libros desde una base global a tus estanterías, visualiza y elimina libros de tu colección.
- **Subida de Libros Propios:** Los usuarios pueden agregar sus propios libros al sistema.
- **Sistema de Reseñas:** Comenta y revisa libros con un sistema de reseñas integrado.
- **Gestión de Portadas:** Sube y administra portadas personalizadas para los libros.
- **Visualización de Colección:** Consulta todos los libros guardados en tus estanterías.
- **Autenticación de Usuarios:** Registro, inicio de sesión y gestión de perfil.

## Tecnologías Utilizadas

### Frontend
- **React 19**: Framework de UI moderno con las últimas características.
- **TypeScript**: Tipado estático para mayor seguridad en el desarrollo.
- **Vite**: Build tool rápido y moderno.
- **TailwindCSS**: Framework de CSS utility-first para estilos rápidos y consistentes.
- **React Router DOM**: Navegación del lado del cliente.
- **Axios**: Cliente HTTP para comunicación con la API.

### Backend
- **Node.js**: Runtime de JavaScript del lado del servidor.
- **Express**: Framework web minimalista y flexible.
- **TypeScript**: Lenguaje principal para el backend.
- **Prisma**: ORM moderno para bases de datos relacionales.
- **Mongoose**: ODM para MongoDB.

### Bases de Datos
- **PostgreSQL**: Base de datos relacional principal para usuarios, libros y estanterías.
- **MongoDB**: Base de datos NoSQL para funcionalidades adicionales como reseñas y portadas de libros.

## Arquitectura de Base de Datos

El proyecto utiliza una **arquitectura híbrida** con dos bases de datos para aprovechar las fortalezas de cada tecnología:

### PostgreSQL (Base de Datos Principal)
Gestiona los datos estructurados y relacionales del sistema:

#### Users
- `id`: Identificador único UUID
- `email`, `username`: Datos de autenticación (únicos)
- `firstName`, `lastName`: Información personal
- `role`: Rol del usuario (ADMIN/USER)
- `password`: Contraseña encriptada
- `createdAt`, `updatedAt`: Timestamps

#### Books
- `id`: Identificador único UUID
- `title`, `author`, `isbn`: Información básica del libro
- `pages`, `publisher`, `language`: Metadatos
- `publishedAt`: Fecha de publicación
- `createdBy`: Referencia al usuario que lo creó (nullable)
- `createdAt`, `updatedAt`: Timestamps

#### Bookshelf
- `id`: Identificador único UUID
- `name`, `description`: Información de la estantería
- `userId`: Relación con el propietario
- `createdAt`, `updatedAt`: Timestamps

#### BookshelfBook
- Tabla de relación entre estantería, libro y usuario
- `bookshelfId`, `bookId`, `userId`: Claves foráneas (clave compuesta única)
- `status`: Estado del libro en la estantería ("pendiente", "leyendo", "terminado")
- `notes`: Notas personales del usuario
- `createdAt`, `updatedAt`: Timestamps

### MongoDB (Base de Datos Complementaria)
Gestiona contenido dinámico y no estructurado:

#### BookCover (Mongoose)
- `bookId`: Referencia al libro en PostgreSQL
- `imageUrl`: URL de la imagen de portada
- `uploadedBy`: ID del usuario que subió la portada
- `uploadedAt`: Timestamp de subida

#### BookReview (Mongoose)
- `bookId`: Referencia al libro en PostgreSQL
- `userId`: ID del usuario que escribió la reseña
- `username`: Nombre del usuario (desnormalizado para performance)
- `content`: Contenido de la reseña
- `createdAt`: Timestamp de creación

### Ventajas de la Arquitectura Híbrida

1. **PostgreSQL** para datos relacionales críticos que requieren ACID y consistencia
2. **MongoDB** para contenido multimedia y datos de crecimiento dinámico
3. **Flexibilidad** para escalar diferentes tipos de contenido independientemente
4. **Performance** optimizada según el tipo de datos

---

# Cómo ejecutar el proyecto (desarrollo)

## 1. Clonar el repositorio

```bash
git clone https://github.com/UTN-BDA/Grupo8-BookShelfManager.git
cd Grupo8-BookShelfManager
```

## 2. Configurar variables de entorno

### Backend
- Copia `backend/.env.template` a `backend/.env` y edítalo con tus datos reales:

```bash
# Puerto del servidor backend
PORT=3000

# Base de datos PostgreSQL
DATABASE_URL=postgres://username:password@localhost:5432/database_name

# URL del frontend para configuración CORS
FRONTEND_URL=http://localhost:5173

# URL mongoDB para la base de datos de libros (reseñas y portadas)
MONGODB_URI=mongodb://localhost:27017/bookshelf
```

### Frontend
- Copia `frontend/.env.template` a `frontend/.env` y ajusta según necesites:

```bash
# API URL - La URL base de la API
VITE_API_URL=http://localhost:3000/api

# Nombre de la aplicación
VITE_APP_NAME=BookShelf Manager

# Tiempo de expiración del token en milisegundos (24 horas)
VITE_TOKEN_EXPIRY=86400000
```

## 3. Instalar dependencias

### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
cd ../frontend
npm install
```

## 4. Preparar las bases de datos

### PostgreSQL (Base de datos principal)
Desde la carpeta `backend`:
```bash
npm run db:generate   # Genera el cliente Prisma
npm run db:migrate    # Aplica migraciones y crea las tablas
```

Puedes usar `npm run db:studio` para abrir Prisma Studio y ver la base de datos PostgreSQL en modo visual.

### MongoDB (Base de datos complementaria)
Asegúrate de que MongoDB esté corriendo en tu sistema:
- **Windows**: Instala MongoDB Community Server desde [mongodb.com](https://www.mongodb.com/try/download/community)
- **macOS**: `brew install mongodb-community`
- **Linux**: Sigue las instrucciones oficiales según tu distribución

El backend se conectará automáticamente a MongoDB usando la URL configurada en `MONGODB_URI`. No requiere migraciones adicionales ya que Mongoose crea las colecciones dinámicamente.

## 5. Ejecutar el backend

Desde la carpeta `backend`:
```bash
npm run dev
```
Por defecto corre en `http://localhost:3000`

## 6. Ejecutar el frontend

Desde la carpeta `frontend`:
```bash
npm run dev
```
Por defecto corre en `http://localhost:5173`

---

# Flujo Básico de Uso

1. **Regístrate o inicia sesión** en la plataforma.
2. **Crea una o más estanterías personales** para organizar tus libros.
3. **Explora la biblioteca global** y agrega libros existentes a tus estanterías.
4. **Sube tus propios libros** si no encuentras lo que buscas en la base global.
5. **Escribe reseñas** para compartir tu opinión sobre los libros.
6. **Personaliza portadas** subiendo imágenes para tus libros.
7. **Visualiza y organiza tu colección** desde la sección "Estanterías".

---

# 🗂️ Sistema de Backup & Restore

Como parte de los requisitos de **Base de Datos Avanzada**, el proyecto incluye un sistema de Backup & Restore mediante scripts.

## 🚀 Comandos Disponibles

```bash
cd backend

# Crear backup de la base de datos
npm run backup

# Listar backups disponibles
npm run backup:list

# Restaurar base de datos de desarrollo (REQUISITO PRINCIPAL)
npm run restore:dev

# Restaurar desde archivo específico
npm run restore:file <archivo>

# Probar el sistema completo
npm run backup:test
```

## 📁 Ubicación de Archivos

- **Scripts:** `backend/scripts/backup.ts` y `backend/scripts/restore.ts`
- **Backups:** `backend/backups/`
- **Documentación:** `backend/scripts/README.md`

## 🎯 Cumplimiento del Requisito

El comando `npm run restore:dev` cumple específicamente con el requisito:
> "Backup & Restore mediante scripts que permite restaurar la DB de desarrollo"

---

# Scripts Útiles

## Backend
- `npm run dev`: Levanta el backend en modo desarrollo.
- `npm run build`: Compila TypeScript a JavaScript.
- `npm run start`: Inicia el servidor en modo producción.
- `npm run db:generate`: Genera el cliente Prisma.
- `npm run db:migrate`: Aplica migraciones de PostgreSQL.
- `npm run db:reset`: Resetea la base de datos PostgreSQL.
- `npm run db:studio`: Abre Prisma Studio.
- `npm run join-books`: Script de benchmark para insertar libros masivamente.
- `npm run search:btree`, `search:hash`, `search:bitmap`, `search:fulltext`, `search:composite`, `search:noindex`: Ejecuta tests de rendimiento de diferentes tipos de índices.

## Frontend
- `npm run dev`: Levanta el frontend en modo desarrollo.
- `npm run build`: Compila la app para producción.
- `npm run lint`: Ejecuta el linter ESLint.
- `npm run preview`: Vista previa de la build de producción.

---

# Requisitos del Sistema

## Software Base
- **Node.js** >= 18.0.0
- **npm** >= 8.0.0 (incluido con Node.js)
- **PostgreSQL** >= 13.0 (base de datos principal)
- **MongoDB** >= 5.0 (base de datos complementaria)

## Instalación de Dependencias

### PostgreSQL
- **Windows**: Descarga desde [postgresql.org](https://www.postgresql.org/download/windows/)
- **macOS**: `brew install postgresql`
- **Linux**: `sudo apt-get install postgresql postgresql-contrib` (Ubuntu/Debian)

### MongoDB
- **Windows**: Descarga MongoDB Community Server desde [mongodb.com](https://www.mongodb.com/try/download/community)
- **macOS**: `brew install mongodb-community`
- **Linux**: Sigue las [instrucciones oficiales](https://docs.mongodb.com/manual/administration/install-on-linux/) según tu distribución

## Verificación de Instalación

```bash
# Verificar Node.js y npm
node --version
npm --version

# Verificar PostgreSQL
psql --version

# Verificar MongoDB
mongod --version
```

---

# Miembros del Equipo

- [@AgustinDevelopment](https://github.com/AgustinDevelopment) Agustin Alanis
- [@Kobyuu](https://github.com/Kobyuu) Juan Manuel Kobayashi
- [@mauurom](https://github.com/mauurom) Mauro Maccarini
- [@AdrianoIzquierdo](https://github.com/AdrianoIzquierdo) Adriano Izquierdo

## Funcionalidades Adicionales

### Sistema de Reseñas
- **Escribir reseñas**: Los usuarios pueden agregar reseñas de texto a cualquier libro.
- **Visualizar reseñas**: Consulta todas las reseñas de un libro específico.
- **Identificación del autor**: Cada reseña muestra el nombre del usuario que la escribió.

### Gestión de Portadas
- **Subir portadas personalizadas**: Los usuarios pueden agregar imágenes de portada a los libros.
- **Control de acceso**: Solo el creador del libro puede modificar su portada.
- **Gestión de URLs**: Sistema de almacenamiento de URLs de imágenes.

### Búsqueda y Performance
- **Índices optimizados**: El sistema incluye múltiples tipos de índices (B-tree, Hash, Bitmap, Full-text, Composite) para optimizar consultas.
- **Scripts de benchmarking**: Herramientas para probar el rendimiento con grandes volúmenes de datos.
- **Búsqueda inteligente**: Búsqueda por título, autor, ISBN y otros campos con autocompletado.

---

