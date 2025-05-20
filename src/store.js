import { legacy_createStore as createStore } from 'redux';

// Verificar si estamos en modo móvil al inicio
const isMobile = window.innerWidth < 992;

// Guardar el valor inicial según el tamaño
localStorage.setItem('initialIsMobile', isMobile.toString());

// Estado inicial
const initialState = {
  sidebarShow: !isMobile, // En móvil comienza cerrado, en desktop abierto
  sidebarUnfoldable: false,
  theme: 'light',
  auth: {
    isAuthenticated: false,
    user: null,
    trabajador: null,
    role: null,
    permissions: {},
    token: null,
  },
  cajaAbierta: {
    idCaja: null,
  },
};

// Función para cargar el estado inicial desde localStorage
const loadInitialState = () => {
  const token = localStorage.getItem('token');
  const idCaja = localStorage.getItem('idCaja');
  
  if (token) {
    const estado = {
      ...initialState,
      auth: {
        isAuthenticated: true,
        user: JSON.parse(localStorage.getItem('user')),
        trabajador: JSON.parse(localStorage.getItem('trabajador')),
        role: localStorage.getItem('rol'),
        permissions: JSON.parse(localStorage.getItem('permissions')) || {},
        token: token,
      },
      cajaAbierta: {
        idCaja: idCaja ? Number(idCaja) : null,
      },
    };
    return estado;
  }
  return initialState;
};

// Reducer
const changeState = (state = loadInitialState(), { type, payload }) => {
  switch (type) {
    case 'set':
      // Si estamos actualizando sidebarShow, verificar posible transición de dispositivo
      if (payload.hasOwnProperty('sidebarShow')) {
        // Comparar la detección actual con la inicial
        const currentIsMobile = window.innerWidth < 992;
        const initialIsMobile = localStorage.getItem('initialIsMobile') === 'true';
        
        // Si hubo un cambio de tipo de dispositivo, actualizar localStorage
        if (currentIsMobile !== initialIsMobile) {
          localStorage.setItem('initialIsMobile', currentIsMobile.toString());
        }
      }
      
      return {
        ...state,
        ...payload,
      };

    case 'LOGIN_SUCCESS':
      // Guardar los datos en localStorage
      localStorage.setItem('token', payload.token);
      localStorage.setItem('user', JSON.stringify(payload.user));
      localStorage.setItem('trabajador', JSON.stringify(payload.trabajador));
      localStorage.setItem('rol', payload.role);
      localStorage.setItem('permissions', JSON.stringify(payload.permissions || {}));
      
      // Recuperar el idCaja existente para este usuario (si existe)
      const idCaja = localStorage.getItem('idCaja');
      
      return {
        ...state,
        auth: {
          isAuthenticated: true,
          user: payload.user,
          trabajador: payload.trabajador,
          role: payload.role,
          permissions: payload.permissions || {},
          token: payload.token,
        },
        cajaAbierta: {
          idCaja: idCaja ? Number(idCaja) : null,
        },
      };

    case 'LOGOUT':
      // Importante: Podemos decidir si queremos mantener el idCaja 
      // al cerrar sesión o no según la lógica de negocio
      
      // Opción 1: Mantener el idCaja para usos futuros
      const idCajaToKeep = localStorage.getItem('idCaja');
      
      // Limpiar localStorage al hacer logout
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('trabajador');
      localStorage.removeItem('rol');
      localStorage.removeItem('permissions');
      
      // Opción 1: Si queremos preservar el idCaja entre sesiones
      // No hacemos nada con localStorage.removeItem('idCaja')
      
      // Opción 2: Si queremos eliminar el idCaja al cerrar sesión
      // Descomenta la siguiente línea:
      // localStorage.removeItem('idCaja');
      
      return {
        ...state,
        auth: {
          isAuthenticated: false,
          user: null,
          trabajador: null,
          role: null,
          permissions: {},
          token: null,
        },
        cajaAbierta: {
          // Opción 1: Mantener el idCaja para usos futuros
          idCaja: idCajaToKeep ? Number(idCajaToKeep) : null,
          
          // Opción 2: Limpiar idCaja en el estado global
          // idCaja: null,
        },
      };

    case 'ABRIR_CAJA':
      // Guardar idCaja en localStorage y en el estado global
      localStorage.setItem('idCaja', payload.idCaja);
      return {
        ...state,
        cajaAbierta: {
          idCaja: payload.idCaja,
        },
      };

    case 'CERRAR_CAJA':
      // Eliminar idCaja de localStorage y del estado global
      localStorage.removeItem('idCaja');
      return {
        ...state,
        cajaAbierta: {
          idCaja: null,
        },
      };

    default:
      return state;
  }
};

// Crear el store
const store = createStore(
  changeState,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

// Exponer el store al objeto window para depuración
window.store = store;

export default store;