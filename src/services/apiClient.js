import axios from 'axios';

// Crear una instancia de Axios con la URL base de tu backend
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
});

// La sesión persistirá siempre en localStorage
// Solo se limpiará cuando:
// 1. El token expire (interceptor 401)
// 2. El usuario haga logout manualmente 

// Agregar un interceptor para incluir el token JWT en las cabeceras
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Log para desarrollo
    if (import.meta.env.VITE_MODE === 'development') {
      console.log('API Request:', config.method.toUpperCase(), config.url);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Agregar un interceptor para manejar respuestas
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        console.error('Error 401: No autorizado. El token podría haber expirado.');
        
        // Limpiar todos los datos de autenticación
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('trabajador');
        localStorage.removeItem('rol');
        localStorage.removeItem('permissions');
        
        // Dispatching LOGOUT action to Redux store if it's available
        if (window.store) {
          window.store.dispatch({ type: 'LOGOUT' });
        }
        
        // Redirigir al login solo si no estamos ya en la página de login
        if (!window.location.hash.includes('/login')) {
          window.location.href = '/#/login';
          // Recargar la página para asegurar que todo el estado se restablezca correctamente
          window.location.reload();
        }
      } else if (error.response.status === 403) {
        console.error('Error 403: Prohibido. No tienes permisos para acceder a este recurso.');
        window.location.href = '/#/acceso-denegado';
      } else if (error.response.status === 500) {
        console.error('Error 500: Error interno del servidor.');
      }
    } else if (error.request) {
      console.error('No se recibió respuesta del servidor.');
      
      // Si no hay respuesta del servidor y tenemos un token, verificar si debemos hacer logout
      const token = localStorage.getItem('token');
      if (token) {
        // Contar cuántos errores de conectividad hemos tenido
        const failedRequests = parseInt(localStorage.getItem('failedRequests') || '0') + 1;
        localStorage.setItem('failedRequests', failedRequests.toString());
        
        // Si hay demasiados errores consecutivos, considerar que la sesión podría estar corrupta
        if (failedRequests > 3) {
          localStorage.removeItem('failedRequests');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('trabajador');
          localStorage.removeItem('rol');
          localStorage.removeItem('permissions');
          
          if (window.store) {
            window.store.dispatch({ type: 'LOGOUT' });
          }
          
          if (!window.location.hash.includes('/login')) {
            window.location.href = '/#/login';
            window.location.reload();
          }
        }
      }
    } else {
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Función para limpiar el contador de errores cuando una petición es exitosa
apiClient.interceptors.response.use(
  (response) => {
    // Si la petición es exitosa, resetear el contador de errores
    localStorage.removeItem('failedRequests');
    return response;
  }
);

export default apiClient;