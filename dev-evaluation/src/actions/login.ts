import { createAsyncAction, createAction } from 'typesafe-actions';
import * as constants from '../constants';
import {
  LoginPayload,
  LoginResponse,
  GoogleLoginPayload,
  Profile,
  SignupPayload,
  Email,
  ForgotPassword
} from '../types';

export const login = createAsyncAction(
  constants.LOGIN_REQUEST,
  constants.LOGIN_SUCCESS,
  constants.LOGIN_FAILURE
)<LoginPayload, LoginResponse, Error>();
export const signup = createAsyncAction(
  constants.SIGNUP_REQUEST,
  constants.SIGNUP_SUCCESS,
  constants.SIGNUP_FAILURE
)<SignupPayload, void, Error>();

export const resetPassword = createAsyncAction(
  constants.RESET_PASSWORD_REQUEST,
  constants.RESET_PASSWORD_SUCCESS,
  constants.RESET_PASSWORD_FAILURE
)<Email, void, Error>();
export const confirmPassword = createAsyncAction(
  constants.CONFIRM_PASSWORD_REQUEST,
  constants.CONFIRM_PASSWORD_SUCCESS,
  constants.CONFIRM_PASSWORD_FAILURE
)<ForgotPassword, void, Error>();
export const logout = createAsyncAction(
  constants.LOGOUT_REQUEST,
  constants.LOGOUT_SUCCESS,
  constants.LOGOUT_FAILURE
)<void, void, Error>();

export const googleLogin = createAsyncAction(
  constants.GOOGLE_LOGIN_REQUEST,
  constants.GOOGLE_LOGIN_SUCCESS,
  constants.GOOGLE_LOGIN_FAILURE
)<GoogleLoginPayload, { key: string }, Error>();

export const profile = createAsyncAction(
  constants.PROFILE_REQUEST,
  constants.PROFILE_SUCCESS,
  constants.PROFILE_FAILURE
)<void, Profile, Error>();

export const resetLoginStatus = createAction(constants.RESET_LOGIN_STATUS)();
export const setCurrentTab = createAction(constants.SET_CURRENT_TAB)<string>();

export const setTheme = createAction(constants.SET_THEME)<boolean>();
