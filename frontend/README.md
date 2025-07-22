# BookShelfManager Frontend

Este frontend está construido con **React**, **TypeScript**, **Vite** y **TailwindCSS**. Se conecta a un backend con arquitectura híbrida (PostgreSQL + MongoDB) y permite a los usuarios:

- **Autenticación**: Registrarse e iniciar sesión con gestión de perfiles
- **Gestión de estanterías**: Crear, editar y eliminar estanterías personales
- **Biblioteca global**: Buscar libros en la base global y agregarlos a estanterías
- **Reseñas y valoraciones**: Ver y gestionar reseñas de libros (MongoDB)
- **Portadas personalizadas**: Visualizar portadas de libros (MongoDB)
- **Colección personal**: Organizar y visualizar la colección de libros
- **Gestión de usuarios**: Ver perfiles de otros usuarios del sistema 

## Estructura

- `src/components/` — Componentes reutilizables
  - `Layout.tsx` — Layout principal con navegación
  - `BookCard.tsx` — Tarjeta de libro con información y acciones
  - `UserCard.tsx` — Tarjeta de usuario con perfil
  - `AddOwnBookForm.tsx` — Formulario para agregar libros propios
  - `EditUserModal.tsx` — Modal para editar perfil de usuario
  - `Alert.tsx`, `Loader.tsx` — Componentes de UI
- `src/pages/` — Páginas principales
  - `BooksPage.tsx` — Biblioteca global de libros
  - `BookDetailPage.tsx` — Detalle de libro individual
  - `BookshelfPage.tsx` — Gestión de estanterías personales
  - `BookshelfDetailPage.tsx` — Vista detallada de una estantería
  - `ProfilePage.tsx` — Perfil de usuario y configuración
  - `UsersPage.tsx` — Lista de usuarios del sistema
  - `LoginPage.tsx`, `RegisterPage.tsx` — Autenticación
- `src/services/` — Servicios para API backend
  - `api.ts` — Configuración base de Axios
  - `bookService.ts` — Gestión de libros (PostgreSQL)
  - `bookshelfService.ts` — Gestión de estanterías (PostgreSQL)
  - `userService.ts` — Gestión de usuarios (PostgreSQL)
  - `bookExtraService.ts` — Reseñas y portadas (MongoDB)
- `src/hooks/` — Hooks personalizados
  - `useBooks.ts`, `useUserBooks.ts` — Gestión de estados de libros
  - `useUsers.ts` — Gestión de estado de usuarios
  - `useBookExtras.ts` — Gestión de reseñas y portadas
- `src/context/` — Contexto global
  - `AuthContext.tsx` — Autenticación y estado de usuario
- `src/types/` — Definiciones de tipos TypeScript

---

# Cómo ejecutar el frontend (desarrollo)

## 1. Requisitos previos

- Node.js >= 18
- Tener el backend corriendo (ver instrucciones en la carpeta `../backend`)

## 2. Configurar variables de entorno

- Copia `.env.template` a `.env` y configura las siguientes variables:

```bash
# URL de la API backend
VITE_API_URL=http://localhost:3000/api

# URL base del backend (para archivos estáticos si aplica)
VITE_BACKEND_URL=http://localhost:3000
```

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

## Desarrollo
- `npm run dev`: Inicia el frontend en modo desarrollo
- `npm run build`: Compila la app para producción
- `npm run preview`: Previsualiza la app de producción localmente
- `npm run lint`: Ejecuta ESLint para revisar el código
- `npm run lint:fix`: Ejecuta ESLint y corrige errores automáticamente

## Calidad de Código
El proyecto incluye configuración de ESLint y se integra con SonarQube para análisis de calidad de código.

---

# Características Técnicas

## Arquitectura del Frontend
- **React 18** con hooks modernos y TypeScript
- **Vite** como build tool para desarrollo rápido
- **TailwindCSS** para estilos utilitarios y diseño responsivo
- **Axios** para comunicación con la API REST
- **Context API** para gestión de estado global de autenticación

## Integración con Backend Híbrido
- **PostgreSQL**: Gestión de usuarios, libros, estanterías (via API REST)
- **MongoDB**: Reseñas y portadas de libros (via API REST)
- Manejo de estados asíncronos con hooks personalizados
- Gestión de errores centralizada

## Funcionalidades Avanzadas
- **Autenticación persistente** con manejo de tokens
- **Búsqueda y filtrado** de libros en tiempo real
- **Gestión de colecciones** con drag & drop (futuro)
- **Sistema de reseñas** integrado con MongoDB
- **Visualización de portadas** dinámicas

---

# Notas

- El frontend consume una **API REST híbrida** (PostgreSQL + MongoDB)
- **Diseño responsivo** y accesible usando TailwindCSS
- **Arquitectura modular** con componentes reutilizables y hooks personalizados
- **Gestión de estado** optimizada para reducir re-renders innecesarios
- **Calidad de código** validada con ESLint y SonarQube
- El flujo principal incluye: crear estantería → buscar libro global → agregar a estantería → gestionar reseñas

Para detalles de la arquitectura completa, configuración del backend y la base de datos híbrida, consulta el README principal del proyecto.
