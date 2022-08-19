
import { ActionType, StateType } from 'typesafe-actions';
import * as actions from '../actions';
import rootReducer from '../reducers';
export * from './accounts';
export * from './core';

export type Store = StateType<typeof rootReducer>;
export type RootState = StateType<typeof rootReducer>;
export type ProjectReduxActions = ActionType<typeof actions>;
export type RootInputAction =  ProjectReduxActions;
export type RootOutputAction = ProjectReduxActions;

export enum APIStatus {
  success = 'success',
  progress = 'progress',
  failed = 'failed',
  uninitiated = 'unintiated'
}

// export interface Layout {
//   is_navbar: boolean;
//   is_coverpic: boolean;
//   is_sidebar: boolean;
//   webContents: {
//     order: number;
//     content_type: string;
//   }[];
//   navbarComponents: Navbar;
// }
