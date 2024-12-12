import { createContext, useContext, useReducer } from 'react';
import { removeAccessToken } from '../utils/auth';

const initialState = {
  isAuthenticated: false,
  user: undefined,
  dispatch: undefined,
};

export const AuthContext = createContext(initialState);

export const useAuth = () => {
  const { isAuthenticated, user, dispatch } = useContext(AuthContext);
  if (!dispatch) throw new Error('useAuth must be used within AuthProvider');
  return { isAuthenticated, user, dispatch };
};

export const AuthActionType = {
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  SET_USER: 'SET_USER',
};

export const authReducer = (state, action) => {
  switch (action.type) {
    case AuthActionType.LOGIN:
      return { 
        ...state, 
        isAuthenticated: true, 
        user: action.payload ?? state.user 
      };
    case AuthActionType.SET_USER:
      return { 
        ...state, 
        user: action.payload 
      };
    case AuthActionType.LOGOUT:
      removeAccessToken();
      return { 
        isAuthenticated: false, 
        user: undefined 
      };
    default:
      return state;
  }
};

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
} 