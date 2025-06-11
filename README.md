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

## Cómo Ejecutar el Proyecto

1. Clona este repositorio.
2. Configura el entorno:
   - Copia `.env.template` a `.env` y edítalo con tus datos de PostgreSQL.
3. Instala dependencias y levanta la app:
   ```bash
   npm install
   npm run dev
   ```
4. Genera la base de datos y aplica migraciones:
   ```bash
   npm run db:generate
   npm run db:migrate
   ```
5. Accede a la aplicación en `http://localhost:3000` (o el puerto configurado).

## Flujo Básico de Uso

1. Regístrate o inicia sesión.
2. Crea una o más estanterías personales.
3. Busca libros en la base global y agrégalos a tus estanterías.
4. Visualiza y organiza tu colección desde la sección "Estanterías".

## Scripts Útiles

- `npm run dev`: Levanta frontend y backend en modo desarrollo.
- `npm run db:generate`: Genera la base de datos.
- `npm run db:migrate`: Aplica migraciones.
- `npm run test:indexes`: Ejecuta tests de índices sobre la base de datos.

## Miembros del Equipo

- [@AgustinDevelopment](https://github.com/AgustinDevelopment) Agustin Alanis
- [@Kobyuu](https://github.com/Kobyuu) Juan Manuel Kobayashi
- [@mauurom](https://github.com/mauurom) Mauro Maccarini
- [@AdrianoIzquierdo](https://github.com/AdrianoIzquierdo) Adriano Izquierdo

