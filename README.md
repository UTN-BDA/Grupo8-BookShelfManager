# BookShelfManager: Plataforma Integral de Gestión de Libros

## Descripción del Proyecto

El proyecto **BookShelfManager** es una plataforma integral diseñada para gestionar, descubrir y disfrutar del mundo de los libros. Este sistema está dirigido tanto a lectores casuales como a bibliófilos, proporcionando herramientas avanzadas como reconocimiento de portadas, recomendaciones personalizadas y gestión de colecciones.

Actualmente, estamos desarrollando el **Producto Mínimo Viable (MVP)** enfocado en la **Gestión Básica de Colección Personal** y un sistema de reconocimiento de portadas mediante inteligencia artificial.

## Módulos Principales del MVP

El MVP se basa en el flujo de **Registro de Libro en Colección** y cubre las siguientes funcionalidades:

1. **Captura de Imagen**: Los usuarios pueden tomar una foto de la portada del libro.
2. **Procesamiento con IA**:
   - Reconocimiento visual para identificar portadas.
   - Extracción de metadatos como título, autor, género y editorial.
3. **Sugerencia de Metadata**: Presentación de los datos sugeridos por el sistema para ser confirmados o editados.
4. **Registro en la Colección**: Almacenamiento del libro en la colección personal del usuario.
5. **Recomendaciones Iniciales**: Basadas en el libro registrado, se sugieren libros similares y posibles lecturas recomendadas.

## Tecnologías Utilizadas

El proyecto utiliza las siguientes tecnologías para garantizar escalabilidad, flexibilidad y rendimiento:

- **TypeScript**: Lenguaje principal para el desarrollo del backend.
- **Prisma**: ORM para la interacción con la base de datos.
- **PostgreSQL**: Base de datos relacional para el almacenamiento de información.
- **Docker**: Contenedores para facilitar la configuración y despliegue de ambientes.
- **Inteligencia Artificial**: Algoritmos para el reconocimiento visual y generación de recomendaciones.

## Estructura de Base de Datos (MVP)

Para el **Producto Mínimo Viable**, solo se incluyen las tablas necesarias para el flujo principal de registro de libros:

### **Users**
- `id`: Identificador único.
- `name`: Nombre del usuario.
- `email`: Correo electrónico.
- `preferences`: Preferencias del usuario.
- `role`: Rol del usuario (lector casual, ávido lector, etc.).

### **Books**
- `id`: Identificador único.
- `title`: Título del libro.
- `author`: Autor del libro.
- `genre`: Género literario.
- `publisher`: Editorial.
- `year`: Año de publicación.
- `cover_image`: Imagen de la portada.

### **Collections**
- `id`: Identificador único.
- `userId`: Referencia al usuario propietario.
- `bookId`: Referencia al libro.
- `status`: Estado del libro en la colección (ej. leído, pendiente).
- `notes`: Notas personales del usuario.
- `location`: Ubicación del libro en la colección.

## Cómo Ejecutar el Proyecto

1. Clona este repositorio.
2. Asegúrate de tener **Docker** instalado.
3. Crea un archivo `.env` basado en el ejemplo proporcionado para configurar las variables de entorno.
4. Levanta los servicios con el comando:
   ```bash
   docker-compose up
   ```
5. Accede a la aplicación en el navegador en `http://localhost:3000`.

##Indices Actividad 

1. hacer un pull del repositorio
2. configurar el .env como esta en .env.template pero con sus datos del postgres
3.correr la app con: npm run dev
4. generar base de datos con: npm run db:generate
5. hacer migraciones con npm run db:migrate
6. hacer los tests de los index (tardan bastante en correr porque son 500k datos los que tiene que leer) (en la terminal te tira los libros que coinciden, tiempo, etc.)
7. hacer el informe 


## Miembros del Equipo

- [@AgustinDevelopment](https://github.com/AgustinDevelopment) Agustin Alanis
- [@Kobyuu](https://github.com/Kobyuu) Juan Manuel Kobayashi
- [@mauurom](https://github.com/mauurom) Mauro Maccarini
- [@AdrianoIzquierdo](https://github.com/AdrianoIzquierdo) Adriano Izquierdo

