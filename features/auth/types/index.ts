export interface AuthFormValues {
  email: string;
  password: string;
  firstName: string
  lastName: string;
  cpassword: string;
};

export interface IActionType {
  LOG_OUT: string;
  SET_USER: string;
  LOADING: string;
  SET_AUTH_STATUS: string;
}

export interface IProfile {
  id: string;
  firstName: string;
  lastName: string;
}

export interface IUser {
  id: string;
  email: string;
  profile: IProfile;
}

export interface IState {
  isAuthenticated: boolean;
  user: IUser | null;
  loading: boolean;
  token: string | null;
}

export interface IAction {
  type: string;
  data?: any;
}

export type IDispatch = ({
  type,
  data,
}: {
  type: string;
  data?: any;
}) => null | void;

export type IReducer = (state: IState, action: IAction) => IState;

export interface IAuthFunction {
  getUser: any;
}
