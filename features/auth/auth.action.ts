import { IActionType, IUser } from "./types";

export const actionType: IActionType = {
  LOG_OUT: 'LOG_OUT',
  SET_USER: 'SET_USER',
  LOADING: 'LOADING',
};

export const setUserData = (user: IUser | null) => {
  return {
    type: actionType.SET_USER,
    data: user,
  };
};

export const setLoading = (loading: boolean) => {
  return {
    type: actionType.LOADING,
    data: loading,
  };
};

export const logOut = () => {
  return {
    type: actionType.LOG_OUT,
  };
};