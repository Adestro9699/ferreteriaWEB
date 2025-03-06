import { legacy_createStore as createStore } from 'redux';

// Estado inicial
const initialState = {
  sidebarShow: true,
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
};

// Función para cargar el estado inicial desde localStorage
const loadInitialState = () => {
  const token = localStorage.getItem('token');
  if (token) {
    return {
      ...initialState,
      auth: {
        isAuthenticated: true,
        user: JSON.parse(localStorage.getItem('user')),
        trabajador: JSON.parse(localStorage.getItem('trabajador')),
        role: localStorage.getItem('role'),
        permissions: JSON.parse(localStorage.getItem('permissions')) || {},
        token: token,
      },
    };
  }
  return initialState;
};

// Reducer
const changeState = (state = loadInitialState(), { type, payload }) => {
  switch (type) {
    case 'set':
      return {
        ...state,
        ...payload,
      };

    case 'LOGIN_SUCCESS':
      console.log("Payload recibido en LOGIN_SUCCESS:", payload);
      // Guardar los datos en localStorage
      localStorage.setItem('token', payload.token);
      localStorage.setItem('user', JSON.stringify(payload.user));
      localStorage.setItem('trabajador', JSON.stringify(payload.trabajador));
      localStorage.setItem('role', payload.role);
      localStorage.setItem('permissions', JSON.stringify(payload.permissions || {}));
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
      };

    case 'LOGOUT':
      // Limpiar localStorage al hacer logout
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('trabajador');
      localStorage.removeItem('role');
      localStorage.removeItem('permissions');
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