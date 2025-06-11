# BookShelfManager Frontend

Este frontend está construido con **React**, **TypeScript**, **Vite** y **TailwindCSS**. Permite a los usuarios:

- Registrarse e iniciar sesión.
- Crear, editar y eliminar estanterías personales.
- Buscar libros en la base global y agregarlos a sus estanterías.
- Visualizar y organizar su colección de libros.

## Estructura

- `src/components/` — Componentes reutilizables (Layout, Loader, BookCard, etc.)
- `src/pages/` — Páginas principales (Libros, Estanterías, Perfil, etc.)
- `src/services/` — Servicios para consumir la API backend.
- `src/hooks/` — Hooks personalizados para lógica de negocio.
- `src/context/` — Contexto de autenticación.

## Scripts

- `npm install` — Instala dependencias.
- `npm run dev` — Inicia el frontend en modo desarrollo (por defecto en `http://localhost:5173`).
- `npm run build` — Compila la app para producción.

## Requisitos

- Node.js >= 18
- Tener el backend corriendo (ver instrucciones en la carpeta `../backend`)

## Configuración

1. Copia `.env.template` a `.env` y ajusta la URL de la API si es necesario.
2. Ejecuta los scripts indicados arriba.

## Notas

- El frontend está preparado para consumir la API REST del backend.
- El diseño es minimalista y accesible, usando TailwindCSS.
- El flujo principal es: crear estantería → buscar libro global → agregar a estantería.

---

Para detalles de la arquitectura y el flujo completo, consulta el README principal del proyecto.
