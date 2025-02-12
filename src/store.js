import { legacy_createStore as createStore } from 'redux';

const initialState = {
  sidebarShow: true,
  sidebarUnfoldable: false, // Inicializa este campo
  theme: 'light',
  auth: {
    isAuthenticated: false,
    user: null,
    role: null,
  },
};

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
          role: payload.role,
        },
      };
    case 'LOGOUT':
      return {
        ...state,
        auth: {
          isAuthenticated: false,
          user: null,
          role: null,
        },
      };
    default:
      return state;
  }
};

const store = createStore(
  changeState,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;