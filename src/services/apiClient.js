import axios from 'axios';

// Crear una instancia de Axios con la URL base de tu backend
const apiClient = axios.create({
  baseURL: 'http://localhost:8080', // URL de tu backend
  timeout: 10000, // Tiempo de espera para las solicitudes (opcional)
});

// Agregar un interceptor para incluir el token JWT en las cabeceras
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Obtener el token del almacenamiento
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Agregar el token a la cabecera
    }
    return config;
  },
  (error) => {
    // Manejar errores en las solicitudes
    return Promise.reject(error);
  }
);

// Agregar un interceptor para manejar respuestas
apiClient.interceptors.response.use(
  (response) => {
    // Si la respuesta es exitosa, simplemente la devolvemos
    return response;
  },
  (error) => {
    // Manejar errores en las respuestas
    if (error.response) {
      // El servidor respondió con un código de estado fuera del rango 2xx
      if (error.response.status === 401) {
        console.error('Error 401: No autorizado. El token podría haber expirado.');
        // Aquí puedes redirigir al usuario al login o intentar refrescar el token
      } else if (error.response.status === 403) {
        console.error('Error 403: Prohibido. No tienes permisos para acceder a este recurso.');
      } else if (error.response.status === 500) {
        console.error('Error 500: Error interno del servidor.');
      }
    } else if (error.request) {
      // La solicitud fue hecha pero no se recibió respuesta
      console.error('No se recibió respuesta del servidor.');
    } else {
      // Otros errores
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;