# Gestion de tareas API

REalizado por Kevin Marin 2025

Este proyecto es una API construida con NestJS que incluye autenticación de usuarios, autorización basada en roles y la gestión de tareas. Los usuarios pueden crear, actualizar, eliminar y ver tareas. Los administradores tienen acceso completo a todas las tareas, mientras que los usuarios solo pueden ver y gestionar sus propias tareas.

## Requisitos
- pnpm (gestor de paquetes)
  En caso de no tener pnpm instalarlo
  npm install -g pnpm
- Node.js (versión LTS)

## Instrucciones para levantar el proyecto

### 1. Clonar el repositorio
git clone 
cd task-manager-api

### 2. Instalar dependencias
pnpm install

### 3. Ejecutar Proyecto
pnpm start:dev

### 4. Acceder a Swagger
La documentación de la API está disponible en Swagger en la siguiente ruta:
http://localhost:3000/api


## Explicación del diseño
El proyecto esta mediante una estructura de modulos cada uno con su responsabilidad 
- AuthModule: Maneja el registro, login, y la gestión de tokens JWT.

- UsersModule: Gestiona los usuarios, roles y sus datos.

- TasksModule: Permite la creación, actualización, eliminación y visualización de tareas.

- CommonModule: Incluye funcionalidades comunes como filtros y validaciones globales.


### Roles
- User: Puede crear, ver, actualizar y eliminar sus propias tareas.

- Admin: Puede ver todas las tareas y gestionar cualquier tarea en el sistema.

### Autenticación y Autorización
El proyecto usa JWT para la autenticación y autorizacion.
Los usuarios se registran e inician sesion para obtener el access token y un refresh token. el token se debe incluir en la cabecera (header) de las solicitudes como parte de la autenticacion

Los tokens expiran cada 15 minutos
Los refresh tokens permiten obtener un nuevo token sin tener que volver a iniciar sesion

### Funcionalidades de la API
- Paginación y Filtros: La API permite filtrar tareas por status, dueDate y realizar paginación utilizando los parámetros page y limit.

- Logging: Se registran los detalles de las solicitudes HTTP, incluyendo el método, la ruta y el tiempo de respuesta, para facilitar el monitoreo y depuración.

### Endpoints

- POST /auth/register: Registra un nuevo usuario.

- POST /auth/login: Inicia sesión y genera los tokens JWT.

- GET /tasks: Obtiene todas las tareas del usuario logueado o todas las tareas si el usuario es admin.

- POST /tasks: Crea una nueva tarea.

- GET /tasks/:id: Obtiene los detalles de una tarea específica.

- PUT /tasks/:id: Actualiza los detalles de una tarea existente.

- DELETE /tasks/:id: Elimina una tarea.



