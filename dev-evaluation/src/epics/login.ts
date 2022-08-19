import { combineEpics, Epic } from 'redux-observable';
import { of } from 'rxjs';

import {
  catchError,
  filter,
  map,
  switchMap,
  throttleTime,
  mergeMap
} from 'rxjs/operators';
import { isActionOf } from 'typesafe-actions';
import {
  login,
  profile,
  googleLogin,
  logout,
  resetLoginStatus,
  signup,
  resetPassword,
  confirmPassword,
} from '../actions';
import { APIDependencies } from '../api';
import { RootInputAction, RootOutputAction, RootState } from '../types';
import { initialScheduler } from '../utils';

export const loginEpic: Epic<
  RootInputAction,
  RootOutputAction,
  RootState,
  APIDependencies
> = (action$, store$, { apis }) => {
  return action$.pipe(
    filter(isActionOf(login.request)),
    switchMap(action => {
      const payload = action.payload;
      return apis.login(payload).pipe(
        throttleTime(1000),
        mergeMap(response => {
          return of(login.success(response.response));
        }),
        catchError(error => of(login.failure(error.response)))
      );
    })
  );
};
export const signupEpic: Epic<
  RootInputAction,
  RootOutputAction,
  RootState,
  APIDependencies
> = (action$, store$, { apis }) => {
  return action$.pipe(
    filter(isActionOf(signup.request)),
    switchMap(action => {
      const payload = action.payload;
      return apis.signup(payload).pipe(
        throttleTime(1000),
        mergeMap(response => {
          return of(
            signup.success(response.response),
          );
        }),
        catchError(error => of(signup.failure(error.response)))
      );
    })
  );
};
export const resetPasswordEpic: Epic<
  RootInputAction,
  RootOutputAction,
  RootState,
  APIDependencies
> = (action$, store$, { apis }) => {
  return action$.pipe(
    filter(isActionOf(resetPassword.request)),
    switchMap(action => {
      const payload = action.payload;
      return apis.resetPassword(payload).pipe(
        throttleTime(1000),
        map(response => {
          return resetPassword.success(response.response);
        }),
        catchError(error => of(resetPassword.failure(error.response)))
      );
    })
  );
};
export const confirmPasswordEpic: Epic<
  RootInputAction,
  RootOutputAction,
  RootState,
  APIDependencies
> = (action$, store$, { apis }) => {
  return action$.pipe(
    filter(isActionOf(confirmPassword.request)),
    switchMap(action => {
      const payload = action.payload;
      return apis.resetConfirmPassword(payload).pipe(
        throttleTime(1000),
        map(response => {
          return confirmPassword.success(response.response);
        }),
        catchError(error => of(confirmPassword.failure(error.response)))
      );
    })
  );
};
export const logoutEpic: Epic<
  RootInputAction,
  RootOutputAction,
  RootState,
  APIDependencies
> = (action$, store$, { apis }) => {
  return action$.pipe(
    filter(isActionOf(logout.request)),
    switchMap(action => {
      return apis.logout().pipe(
        throttleTime(1000),
        mergeMap(response => {
          return of(logout.success(response.response), resetLoginStatus());
        }),
        catchError(error => of(login.failure(error.response)))
      );
    })
  );
};

export const profileEpic: Epic<
  RootInputAction,
  RootOutputAction,
  RootState,
  APIDependencies
> = (action$, store$, { apis }) => {
  return action$.pipe(
    filter(isActionOf(profile.request)),
    switchMap(action => {
      return apis.profile().pipe(
        mergeMap(response => {
          return of(
            profile.success(response.response),
          );
        }),
        catchError(error => of(profile.failure(error.response)))
      );
    })
  );
};

export const LoginEpic = combineEpics(
  loginEpic,
  profileEpic,
  logoutEpic,
  signupEpic,
  resetPasswordEpic,
  confirmPasswordEpic,
);

export default LoginEpic;
