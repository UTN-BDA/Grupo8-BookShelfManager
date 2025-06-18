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

---

# Cómo ejecutar el backend (desarrollo)

## 1. Requisitos previos

- Node.js >= 18
- PostgreSQL corriendo y accesible

## 2. Configurar variables de entorno

- Copia `.env.template` a `.env` y configura la variable `DATABASE_URL` con los datos de tu base de datos PostgreSQL.
- Puedes ajustar el puerto (`PORT`) y la URL del frontend (`FRONTEND_URL`) si es necesario.

## 3. Instalar dependencias

```bash
npm install
```

## 4. Preparar la base de datos

```bash
npm run db:generate   # Genera el cliente Prisma
npm run db:migrate    # Aplica migraciones y crea las tablas
```

Puedes usar `npm run db:studio` para abrir Prisma Studio y ver la base de datos en modo visual.

## 5. Ejecutar el backend

```bash
npm run dev
```
Por defecto corre en `http://localhost:3000`

---

# Scripts útiles

- `npm run dev`: Inicia el backend en modo desarrollo.
- `npm run db:generate`: Genera el cliente Prisma.
- `npm run db:migrate`: Aplica migraciones.
- `npm run db:studio`: Abre Prisma Studio.
- `npm run search:btree`, `search:hash`, etc.: Ejecuta tests de índices.

---

# Notas

- El backend implementa control de acceso y relaciones entre usuarios, libros y estanterías.
- La API está preparada para ser consumida por el frontend del proyecto.

Para detalles de la arquitectura y el flujo completo, consulta el README principal del proyecto.
