# BookShelfManager: Plataforma Integral de Gestión de Libros

## Descripción del Proyecto

BookShelfManager es una plataforma web para gestionar, descubrir y disfrutar libros. Permite a los usuarios crear estanterías personales, agregar libros desde una base global, y organizar su colección. El sistema está dirigido tanto a lectores casuales como a bibliófilos, e incluye funcionalidades de gestión de colecciones y recomendaciones personalizadas.

Actualmente, el MVP se enfoca en la **gestión básica de la colección personal** y la organización de libros en estanterías.

## Módulos Principales del MVP

- **Gestión de Estanterías:** Crea, edita y elimina estanterías personales.
- **Gestión de Libros:** Agrega libros desde una base global a tus estanterías, visualiza y elimina libros de tu colección.
- **Visualización de Colección:** Consulta todos los libros guardados en tus estanterías.
- **Autenticación de Usuarios:** Registro, inicio de sesión y gestión de perfil.

## Tecnologías Utilizadas

- **TypeScript**: Lenguaje principal para frontend y backend.
- **React + Vite**: Frontend moderno y rápido.
- **TailwindCSS**: Estilos minimalistas y accesibles.
- **Prisma**: ORM para la base de datos.
- **PostgreSQL**: Base de datos relacional.
- **Express**: Backend API REST.

## Estructura de Base de Datos (MVP)

### Users
- `id`: Identificador único
- `name`, `email`, `username`, `role`, etc.

### Books
- `id`: Identificador único
- `title`, `author`, `genre`, `publisher`, `year`, `cover_image`, etc.

### Bookshelf
- `id`: Identificador único
- `name`, `description`, `userId`

### BookshelfBook
- Relación entre estantería, libro y usuario
- `status`, `notes`, `createdAt`, etc.

---

# Cómo ejecutar el proyecto (desarrollo)

## 1. Clonar el repositorio

```bash
git clone https://github.com/UTN-BDA/Grupo8-BookShelfManager.git
cd Grupo8-BookShelfManager
```

## 2. Configurar variables de entorno

### Backend
- Copia `backend/.env.template` a `backend/.env` y edítalo con tus datos reales de PostgreSQL y puerto si es necesario.

### Frontend
- Copia `frontend/.env.template` a `frontend/.env` y ajusta la URL de la API si es necesario (por defecto: `http://localhost:5173`).

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

## 4. Preparar la base de datos

Desde la carpeta `backend`:
```bash
npm run db:generate   # Genera el cliente Prisma
npm run db:migrate    # Aplica migraciones y crea las tablas
```

Puedes usar `npm run db:studio` para abrir Prisma Studio y ver la base de datos en modo visual.

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

1. Regístrate o inicia sesión.
2. Crea una o más estanterías personales.
3. Busca libros en la base global y agrégalos a tus estanterías.
4. Visualiza y organiza tu colección desde la sección "Estanterías".

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
- `npm run db:generate`: Genera el cliente Prisma.
- `npm run db:migrate`: Aplica migraciones.
- `npm run db:studio`: Abre Prisma Studio.
- `npm run search:btree`, `search:hash`, etc.: Ejecuta tests de índices.

## Frontend
- `npm run dev`: Levanta el frontend en modo desarrollo.
- `npm run build`: Compila la app para producción.

---

# Requisitos

- Node.js >= 18
- PostgreSQL corriendo y accesible

---

# Miembros del Equipo

- [@AgustinDevelopment](https://github.com/AgustinDevelopment) Agustin Alanis
- [@Kobyuu](https://github.com/Kobyuu) Juan Manuel Kobayashi
- [@mauurom](https://github.com/mauurom) Mauro Maccarini
- [@AdrianoIzquierdo](https://github.com/AdrianoIzquierdo) Adriano Izquierdo

