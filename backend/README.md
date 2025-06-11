# BookShelfManager Backend

Este backend está construido con **Node.js**, **TypeScript**, **Express** y **Prisma**. Expone una API REST para gestionar usuarios, libros y estanterías.

## Funcionalidades principales

- **Autenticación de usuarios** (registro, login, perfil)
- **Gestión de libros** (CRUD global de libros)
- **Gestión de estanterías** (crear, listar, editar, eliminar)
- **Agregar libros a estanterías** (relación usuario-estantería-libro)

## Estructura

- `src/api-user/` — Endpoints y lógica de usuarios
- `src/api-book/` — Endpoints y lógica de libros
- `src/api-bookshelf/` — Endpoints y lógica de estanterías
- `src/config/` — Configuración de Prisma y Express
- `prisma/schema.prisma` — Definición de modelos y relaciones

## Scripts

- `npm install` — Instala dependencias
- `npm run dev` — Inicia el backend en modo desarrollo (por defecto en `http://localhost:3000`)
- `npm run db:generate` — Genera la base de datos
- `npm run db:migrate` — Aplica migraciones
- `npm run test:indexes` — Ejecuta tests de índices sobre la base de datos

## Requisitos

- Node.js >= 18
- PostgreSQL corriendo y accesible

## Configuración

1. Copia `.env.template` a `.env` y configura la variable `DATABASE_URL` con los datos de tu base de datos PostgreSQL.
2. Ejecuta los scripts indicados arriba.

## Notas

- El backend implementa control de acceso y relaciones entre usuarios, libros y estanterías.
- Usa Prisma como ORM y expone endpoints REST documentados en el código fuente.

---

Para detalles de endpoints y modelos, consulta el código fuente y el README principal del proyecto.
