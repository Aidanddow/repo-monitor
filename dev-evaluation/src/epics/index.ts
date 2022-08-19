import { combineEpics } from 'redux-observable';
import login from './login';
import core from './core';
/**
 * Root epic will have all the epics combined together
 * various epics being:
 *  * sampleEpic
 */
const rootEpic = combineEpics(
  login,
  core,
);

export default rootEpic;
