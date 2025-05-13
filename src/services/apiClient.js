import axios from 'axios';

// Crear una instancia de Axios con la URL base de tu backend
const apiClient = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL || 'http://localhost:8080'}/fs`,
  timeout: 10000,
});

// Agregar un interceptor para incluir el token JWT en las cabeceras
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else if (error.response.status === 403) {
        console.error('Error 403: Prohibido. No tienes permisos para acceder a este recurso.');
        window.location.href = '/acceso-denegado';
      } else if (error.response.status === 500) {
        console.error('Error 500: Error interno del servidor.');
      }
    } else if (error.request) {
      console.error('No se recibió respuesta del servidor.');
    } else {
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;