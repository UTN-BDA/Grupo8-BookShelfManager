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

---

# Cómo ejecutar el frontend (desarrollo)

## 1. Requisitos previos

- Node.js >= 18
- Tener el backend corriendo (ver instrucciones en la carpeta `../backend`)

## 2. Configurar variables de entorno

- Copia `.env.template` a `.env` y ajusta la URL de la API si es necesario (por defecto: `http://localhost:3000/api`).

## 3. Instalar dependencias

```bash
npm install
```

## 4. Ejecutar el frontend

```bash
npm run dev
```
Por defecto la app estará disponible en `http://localhost:5173`

## 5. Compilar para producción

```bash
npm run build
```

---

# Scripts útiles

- `npm run dev`: Inicia el frontend en modo desarrollo.
- `npm run build`: Compila la app para producción.
- `npm run preview`: Previsualiza la app de producción localmente.

---

# Notas

- El frontend está preparado para consumir la API REST del backend.
- El diseño es minimalista y accesible, usando TailwindCSS.
- El flujo principal es: crear estantería → buscar libro global → agregar a estantería.

Para detalles de la arquitectura y el flujo completo, consulta el README principal del proyecto.
