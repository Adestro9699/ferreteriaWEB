import { legacy_createStore as createStore } from 'redux'

// Estado inicial que incluye la autenticación
const initialState = {
  sidebarShow: true,
  theme: 'light',
  auth: {
    isAuthenticated: false,  // Estado de autenticación
    user: null,              // Información del usuario
  }
}

// Reducer que maneja la autenticación y el resto de los estados
const changeState = (state = initialState, { type, payload }) => {
  switch (type) {
    case 'set':
      return { ...state, ...payload }
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        auth: { isAuthenticated: true, user: payload },
      }
    case 'LOGOUT':
      return {
        ...state,
        auth: { isAuthenticated: false, user: null },
      }
    default:
      return state
  }
}

const store = createStore(changeState)
export default store
