import React, {createContext, useContext, useReducer} from 'react';
import { IAction, IActionType, IAuthFunction, IDispatch, IReducer, IState } from './types';


export const initialState: IState = {
  isAuthenticated: false,
  user: null,
  loading: true,
  token: null,
};

export const actionType: IActionType = {
  LOG_OUT: 'LOG_OUT',
  SET_USER: 'SET_USER',
  LOADING: 'LOADING',
  SET_AUTH_STATUS: 'SET_AUTH_STATUS',
};

const AuthStateContext = createContext<IState | undefined>(initialState);
const AuthDispatchContext = createContext<IDispatch | undefined>(undefined);
const AuthFunctionContext = createContext<IAuthFunction | undefined>(undefined);

const reducer: IReducer = (state: IState, action: IAction) => {
  switch (action.type) {
    case actionType.LOG_OUT:
      return {...state, isAuthenticated: false, user: null, loading: false };
    case actionType.SET_USER:
      return {...state, user: action.data, isAuthenticated: !!action?.data?.id};
    case actionType.SET_AUTH_STATUS:
      return {...state, isAuthenticated: action.data};
    case actionType.LOADING:
      return {...state, loading: action.data};
    default:
      return state;
  }
};

export function useAuthState() {
  const state = useContext(AuthStateContext);

  if (state === undefined) {
    throw new Error('useAuthState can only be used inside AuthProvider');
  }
  return state;
}

export function useAuthDispatch() {
  const context = useContext(AuthDispatchContext);

  if (context === undefined) {
    throw new Error('useAuthDispatch can only be used inside AuthProvider');
  }

  return context;
}

export function useAuthFunction() {
  const context = useContext(AuthFunctionContext);

  if (context === undefined) {
    throw new Error('useAuthFunction can only be used inside AuthProvider');
  }

  return context;
}

export function AuthProvider({children}: {children: any}) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AuthStateContext.Provider value={state}>
      <AuthDispatchContext.Provider value={dispatch}>
          {children}
      </AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  );
}