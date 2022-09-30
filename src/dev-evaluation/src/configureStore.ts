
import { createBrowserHistory } from 'history';
import { configureStore } from '@reduxjs/toolkit'
import { createEpicMiddleware } from 'redux-observable';
import * as actions from './actions';
import { ProjectDependencies, setToken } from './api';
import rootEpic from './epics';
import rootReducer from './reducers';
import { RootInputAction, RootOutputAction, RootState } from './types';
import { getLocalStorage, setLocalStorage } from './utils';

const epicMiddleware = createEpicMiddleware<
  RootInputAction,
  RootOutputAction,
  RootState
>({
  dependencies: ProjectDependencies
});

export const history = createBrowserHistory();
export const configStore = (initialStore: {}) => {
  const _store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(epicMiddleware),
  });
  epicMiddleware.run(rootEpic);
  return _store;
};

export const store = configStore({});

// setLocalStorage('PROJECT_TOKEN', 'jhjhj');
// const token = getLocalStorage('PROJECT_TOKEN');
// if (token) {
//   setToken(token);
//   // const payload = {
//   //   authenticated: true,
//   //   success: true,
//   //   token
//   // };
//   store.dispatch(actions.profile.request());
// }
