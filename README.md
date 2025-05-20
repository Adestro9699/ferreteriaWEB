# Sistema de Gestión para Ferretería

Sistema web para la gestión de una ferretería, desarrollado con React y Vite.

## Características

- Gestión de inventario
- Control de ventas
- Gestión de clientes
- Gestión de proveedores
- Control de caja
- Gestión de usuarios y permisos
- Reportes y estadísticas

## Requisitos

- Node.js >= 16.0.0
- npm >= 7.0.0

## Instalación

1. Clonar el repositorio:
```bash
git clone <url-del-repositorio>
cd ferreteria-web
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:
```
REACT_APP_API_URL=https://ferreteria-semgar-production.up.railway.app
REACT_APP_ENV=development
```

## Desarrollo

Para iniciar el servidor de desarrollo:
```bash
npm run dev
```

## Construcción

Para construir la aplicación para producción:
```bash
npm run build
```

## Despliegue

La aplicación está configurada para ser desplegada en Vercel. Para desplegar:

1. Instalar Vercel CLI:
```bash
npm install -g vercel
```

2. Desplegar:
```bash
vercel
```

## Estructura del Proyecto

```
src/
  ├── actions/        # Acciones de Redux
  ├── assets/         # Recursos estáticos
  ├── components/     # Componentes reutilizables
  ├── layout/         # Componentes de layout
  ├── scss/          # Estilos
  ├── services/      # Servicios (API, etc.)
  └── views/         # Vistas principales
```

## Tecnologías Utilizadas

- React
- Redux
- Vite
- CoreUI
- Axios
- React Router
- JWT para autenticación
