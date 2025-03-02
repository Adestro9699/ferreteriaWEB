import { legacy_createStore as createStore } from 'redux';

// Estado inicial
const initialState = {
  sidebarShow: true,
  sidebarUnfoldable: false, // Inicializa este campo
  theme: 'light',
  auth: {
    isAuthenticated: false,
    user: null,
    trabajador: null,
    role: null,
    permissions: {}, // Agrega los permisos aquí
    token: null,
  },
};

// Reducer
const changeState = (state = initialState, { type, payload }) => {
  switch (type) {
    case 'set':
      return {
        ...state,
        ...payload, // Actualiza múltiples campos
      };

    case 'LOGIN_SUCCESS':
      return {
        ...state,
        auth: {
          isAuthenticated: true,
          user: payload.user,
          trabajador: payload.trabajador, // Almacenar el trabajador vinculado
          role: payload.role,
          permissions: payload.permissions || {}, // Asegúrate de que siempre sea un objeto
          token: payload.token, // Almacena el token aquí
        },
      };

    case 'LOGOUT':
      return {
        ...state,
        auth: {
          isAuthenticated: false,
          user: null,
          trabajador: null,
          role: null,
          permissions: {}, // Limpia los permisos al hacer logout
          token: null,
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

export default store;