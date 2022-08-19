import { combineReducers } from 'redux';
import { getType } from 'typesafe-actions';
import * as actions from '../actions';
import { setToken } from '../api';
import {
  APIStatus,
  ProjectReduxActions,
  Profile,
  ClientPayload
} from '../types';
import { setLocalStorage } from '../utils';
export interface LoginState {
  isMobile: boolean;
  loaders: Loaders;
  message: Message;
  profile: Profile;
}
const defaultUser: Profile = {
  username: '',
  uuid: '',
  email: ''
};
interface Message {
  login: string;
  signup: string;
}
interface Loaders {
  profile: APIStatus;
  login: APIStatus;
  signup: APIStatus;
  resetPassword: APIStatus;
  confirmPassword: APIStatus;
}
export const defaultMessages: Message = {
  login: '',
  signup: ''
};
export const defaultLoaders: Loaders = {
  profile: APIStatus.uninitiated,
  login: APIStatus.uninitiated,
  signup: APIStatus.uninitiated,
  resetPassword: APIStatus.uninitiated,
  confirmPassword: APIStatus.uninitiated
};

export default combineReducers<LoginState, ProjectReduxActions>({
  isMobile: (state = false, action) => {
    switch (action.type) {
      case getType(actions.profile.success): {
        return window.innerWidth < 480;
      }
      case getType(actions.login.success): {
        return window.innerWidth < 480;
      }
      default:
        return state;
    }
  },
  loaders: (state = defaultLoaders, action) => {
    switch (action.type) {
      case getType(actions.login.request): {
        return { ...state, login: APIStatus.progress };
      }
      case getType(actions.profile.request): {
        return {
          ...state,
          login: APIStatus.success,
          profile: APIStatus.progress
        };
      }
      case getType(actions.profile.success): {
        return {
          ...state,
          login: APIStatus.success,
          profile: APIStatus.success
        };
      }
      case getType(actions.profile.failure): {
        return { ...state, login: APIStatus.failed, profile: APIStatus.failed };
      }
      case getType(actions.login.success): {
        setLocalStorage('PROJECT_TOKEN', action.payload.token);
        setToken(action.payload.token);
        return {
          ...state,
          login: APIStatus.success,
          profile: APIStatus.success
        };
      }
      case getType(actions.login.failure): {
        return { ...state, login: APIStatus.failed };
      }
      case getType(actions.googleLogin.request): {
        return {
          ...state,
          login: APIStatus.progress,
          signup: APIStatus.progress
        };
      }
      case getType(actions.googleLogin.success): {
        setLocalStorage('PROJECT_TOKEN', action.payload.key);
        setToken(action.payload.key);
        return {
          ...state,
          login: APIStatus.success,
          signup: APIStatus.success
        };
      }
      case getType(actions.googleLogin.failure): {
        return { ...state, login: APIStatus.failed, signup: APIStatus.failed };
      }
      case getType(actions.signup.request): {
        return { ...state, signup: APIStatus.progress };
      }
      case getType(actions.signup.success): {
        return { ...state, signup: APIStatus.success };
      }
      case getType(actions.signup.failure): {
        return { ...state, signup: APIStatus.failed };
      }
      case getType(actions.resetPassword.request): {
        return { ...state, resetPassword: APIStatus.progress };
      }
      case getType(actions.resetPassword.success): {
        return { ...state, resetPassword: APIStatus.success };
      }
      case getType(actions.resetPassword.failure): {
        return { ...state, resetPassword: APIStatus.failed };
      }
      case getType(actions.confirmPassword.request): {
        return { ...state, confirmPassword: APIStatus.progress };
      }
      case getType(actions.confirmPassword.success): {
        return { ...state, confirmPassword: APIStatus.success };
      }
      case getType(actions.confirmPassword.failure): {
        return { ...state, confirmPassword: APIStatus.failed };
      }
      case getType(actions.resetLoginStatus): {
        setLocalStorage('PROJECT_TOKEN', '');
        setToken('');
        return { ...state, login: APIStatus.uninitiated };
      }

      default:
        return state;
    }
  },
  message: (state = defaultMessages, action) => {
    switch (action.type) {
      case getType(actions.login.failure): {
        return { ...state, login: Object.values(action.payload)[0] };
      }
      case getType(actions.googleLogin.failure): {
        return {
          ...state,
          login: Object.values(action.payload)[0],
          signup: Object.values(action.payload)[0]
        };
      }
      case getType(actions.signup.request): {
        return { ...state, signup: '' };
      }

      case getType(actions.signup.failure): {
        return { ...state, signup: Object.values(action.payload)[0] };
      }
      default:
        return state;
    }
  },
  profile: (state = defaultUser, action) => {
    switch (action.type) {
      case getType(actions.profile.success): {
        return action.payload;
      }
      case getType(actions.login.success): {
        return action.payload.user;
      }
      default:
        return state;
    }
  }
});
