
// import { History } from "history";
import { createBrowserHistory } from 'history';
import { combineReducers } from 'redux';
import core from './core';
export const history = createBrowserHistory();
const rootReducer = combineReducers({
  core
});
export default rootReducer;
