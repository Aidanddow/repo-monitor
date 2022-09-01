import { combineEpics } from 'redux-observable';

import core from './core';
/**
 * Root epic will have all the epics combined together
 * various epics being:
 *  * sampleEpic
 */
const rootEpic = combineEpics(
  core,
);

export default rootEpic;
