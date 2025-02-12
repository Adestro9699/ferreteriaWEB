import axios from 'axios';

// Crear una instancia de Axios con la URL base de tu backend
const apiClient = axios.create({
  baseURL: 'http://localhost:8080', // URL de tu backend
});

// Agregar un interceptor para incluir el token JWT en las cabeceras
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Obtener el token del almacenamiento
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Agregar el token a la cabecera
  }
  return config;
});

export default apiClient;