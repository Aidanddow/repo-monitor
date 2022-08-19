
// import { History } from "history";
import { createBrowserHistory } from 'history';
import { combineReducers } from 'redux';
import login from './login';
import core from './core';
export const history = createBrowserHistory();
const rootReducer = combineReducers({
  login,
  core
});
export default rootReducer;
