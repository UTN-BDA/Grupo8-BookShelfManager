# BookShelfManager Backend

Este backend está construido con **Node.js**, **TypeScript**, **Express**, **Prisma** y **Mongoose**. Expone una API REST para gestionar usuarios, libros y estanterías, utilizando una arquitectura híbrida con PostgreSQL y MongoDB.

## Funcionalidades principales

- **Autenticación de usuarios** (registro, login, perfil)
- **Gestión de libros** (CRUD global de libros con transacciones ACID)
- **Gestión de estanterías** (crear, listar, editar, eliminar)
- **Agregar libros a estanterías** (relación usuario-estantería-libro)
- **Sistema de reseñas** (MongoDB - comentarios y valoraciones)
- **Gestión de portadas** (MongoDB - subida y administración de imágenes)
- **Optimización de búsquedas** (múltiples tipos de índices)

## Arquitectura de Datos

### PostgreSQL (Prisma) - Datos Relacionales
- **Users**: Gestión de usuarios y autenticación
- **Books**: Catálogo principal de libros
- **Bookshelf**: Estanterías personales de usuarios
- **BookshelfBook**: Relaciones entre usuarios, libros y estanterías

### MongoDB (Mongoose) - Datos Dinámicos
- **BookCover**: Portadas personalizadas de libros
- **BookReview**: Sistema de reseñas y comentarios

## Estructura

- `src/api-user/` — Endpoints y lógica de usuarios
- `src/api-book/` — Endpoints y lógica de libros (incluye controladores de portadas y reseñas)
- `src/api-bookshelf/` — Endpoints y lógica de estanterías
- `src/config/` — Configuración de Prisma, Express y MongoDB
- `src/models/` — Modelos de MongoDB (BookCover, BookReview)
- `scripts/` — Scripts de backup, restore y testing de índices
- `prisma/schema.prisma` — Definición de modelos y relaciones PostgreSQL

---

# Cómo ejecutar el backend (desarrollo)

## 1. Requisitos previos

- Node.js >= 18
- PostgreSQL >= 13 corriendo y accesible
- MongoDB >= 5.0 corriendo y accesible

## 2. Configurar variables de entorno

- Copia `.env.template` a `.env` y configura las siguientes variables:

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

## 3. Instalar dependencias

```bash
npm install
```

## 4. Preparar las bases de datos

### PostgreSQL
```bash
npm run db:generate   # Genera el cliente Prisma
npm run db:migrate    # Aplica migraciones y crea las tablas
```

### MongoDB
El backend se conecta automáticamente a MongoDB usando la URL configurada en `MONGODB_URI`. Las colecciones se crean dinámicamente cuando sea necesario.

Puedes usar `npm run db:studio` para abrir Prisma Studio y ver la base de datos PostgreSQL en modo visual.

## 5. Ejecutar el backend

```bash
npm run dev
```
Por defecto corre en `http://localhost:3000`

---

# Scripts útiles

## Desarrollo
- `npm run dev`: Inicia el backend en modo desarrollo.
- `npm run build`: Compila TypeScript a JavaScript.
- `npm run start`: Inicia el servidor en modo producción.

## Base de Datos
- `npm run db:generate`: Genera el cliente Prisma.
- `npm run db:migrate`: Aplica migraciones de PostgreSQL.
- `npm run db:reset`: Resetea la base de datos PostgreSQL.
- `npm run db:studio`: Abre Prisma Studio.

## Testing y Performance
- `npm run join-books`: Script de benchmark para insertar libros masivamente.
- `npm run search:btree`: Test de rendimiento con índices B-tree.
- `npm run search:hash`: Test de rendimiento con índices Hash.
- `npm run search:bitmap`: Test de rendimiento con índices Bitmap.
- `npm run search:fulltext`: Test de rendimiento con índices Full-text.
- `npm run search:composite`: Test de rendimiento con índices Composite.
- `npm run search:noindex`: Test de rendimiento sin índices.

## Backup y Restore
- `npm run backup`: Crear backup de la base de datos.
- `npm run backup:list`: Listar backups disponibles.
- `npm run restore:dev`: Restaurar base de datos de desarrollo.
- `npm run restore:file`: Restaurar desde archivo específico.
- `npm run backup:test`: Probar el sistema completo de backup/restore.

---

# Características Técnicas

## Transacciones ACID
El backend implementa transacciones ACID usando Prisma y PostgreSQL en operaciones críticas como:
- Creación de libros y asociación a estanterías (`findOrCreateAndAddToBookshelf`)
- Garantía de consistencia en operaciones complejas con rollback automático

## Optimización de Búsquedas
- Múltiples tipos de índices para optimizar consultas
- Scripts de benchmarking para evaluar rendimiento
- Soporte para grandes volúmenes de datos

## Arquitectura Híbrida
- **PostgreSQL**: Datos relacionales críticos que requieren ACID
- **MongoDB**: Contenido multimedia y datos de crecimiento dinámico

---

# Notas

- El backend implementa una **arquitectura híbrida** con PostgreSQL y MongoDB
- **Control de acceso** y relaciones complejas entre usuarios, libros y estanterías
- **Transacciones ACID** para operaciones críticas con rollback automático
- **Sistema de reseñas y portadas** usando MongoDB para flexibilidad
- **Optimización de performance** con múltiples tipos de índices
- La API está preparada para ser consumida por el frontend del proyecto

Para detalles de la arquitectura completa y el flujo de usuario, consulta el README principal del proyecto.
