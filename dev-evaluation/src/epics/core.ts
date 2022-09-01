import { combineEpics, Epic } from 'redux-observable';
import { of } from 'rxjs';

import {
  catchError,
  filter,
  switchMap,
  mergeMap
} from 'rxjs/operators';
import { isActionOf } from 'typesafe-actions';
import {
  fetchCurrentRepository,
  fetchRepositories,
  fetchGraphData,
  fetch,
  addRepo,
  fetchCommits,
  fetchDevelopers,
  fetchDeveloperGraphData,
  fetchDevCommits,
  fetchTopRepo,
  fetchDevProjects,
  fetchDashboardCount,
  fetchInactiveDevelopers,
  archiveRepo,
  fetchAllRepo,
} from '../actions';
import { APIDependencies } from '../api';
import { GraphData, RootInputAction, RootOutputAction, RootState } from '../types';


export const fetchRepositoriesEpic: Epic<
  RootInputAction,
  RootOutputAction,
  RootState,
  APIDependencies
> = (action$, store$, { apis }) => {
  return action$.pipe(
    filter(isActionOf(fetchRepositories.request)),
    switchMap(action => {
      return apis.fetchRepositories().pipe(
        mergeMap(response => {
          return of(
            fetchRepositories.success(response.response),
          );
        }),
        catchError(error => of(fetchRepositories.failure(error.response)))
      );
    })
  );
};

export const fetchDevelopersEpic: Epic<
  RootInputAction,
  RootOutputAction,
  RootState,
  APIDependencies
> = (action$, store$, { apis }) => {
  return action$.pipe(
    filter(isActionOf(fetchDevelopers.request)),
    switchMap(action => {
      return apis.fetchDevelopers().pipe(
        mergeMap(response => {
          return of(
            fetchDevelopers.success(response.response),
          );
        }),
        catchError(error => of(fetchDevelopers.failure(error.response)))
      );
    })
  );
};

export const fetchCurrentRepsoitoryEpic: Epic<
  RootInputAction,
  RootOutputAction,
  RootState,
  APIDependencies
> = (action$, store$, { apis }) => {
  return action$.pipe(
    filter(isActionOf(fetchCurrentRepository.request)),
    switchMap(action => {
      const data = action.payload;
      return apis.fetchCurrentRepository(data).pipe(
        mergeMap(response => {
          return of(
            fetchCurrentRepository.success(response.response),
          );
        }),
        catchError(error => of(fetchCurrentRepository.failure(error.response)))
      );
    })
  );
};

export const fetchGraphdataEpic: Epic<
  RootInputAction,
  RootOutputAction,
  RootState,
  APIDependencies
> = (action$, store$, { apis }) => {
  return action$.pipe(
    filter(isActionOf(fetchGraphData.request)),
    switchMap(action => {
      const data = action.payload;
      return apis.graphData(data).pipe(
        mergeMap(response => {
          response.response.map((item: GraphData)=>{
           item.date = item.date__date
          })
          return of(
          
            fetchGraphData.success(response.response),
          );
        }),
        catchError(error => of(fetchGraphData.failure(error.response)))
      );
    })
  );
};

export const fetchTopReposEpic: Epic<
  RootInputAction,
  RootOutputAction,
  RootState,
  APIDependencies
> = (action$, store$, { apis }) => {
  return action$.pipe(
    filter(isActionOf(fetchTopRepo.request)),
    switchMap(action => {
      const data = action.payload;
      return apis.fetchTopRepos(data).pipe(
        mergeMap(response => {
          return of(
          
            fetchTopRepo.success(response.response),
          );
        }),
        catchError(error => of(fetchTopRepo.failure(error.response)))
      );
    })
  );
};
export const fetchDevProjectsEpic: Epic<
  RootInputAction,
  RootOutputAction,
  RootState,
  APIDependencies
> = (action$, store$, { apis }) => {
  return action$.pipe(
    filter(isActionOf(fetchDevProjects.request)),
    switchMap(action => {
      const data = action.payload;
      return apis.fetchDevProjects(data).pipe(
        mergeMap(response => {
          return of(
          
            fetchDevProjects.success(response.response),
          );
        }),
        catchError(error => of(fetchDevProjects.failure(error.response)))
      );
    })
  );
};
export const fetchDashboardCountEpic: Epic<
  RootInputAction,
  RootOutputAction,
  RootState,
  APIDependencies
> = (action$, store$, { apis }) => {
  return action$.pipe(
    filter(isActionOf(fetchDashboardCount.request)),
    switchMap(action => {
      return apis.fetchDashboardCount().pipe(
        mergeMap(response => {
          return of(
          
            fetchDashboardCount.success(response.response),
          );
        }),
        catchError(error => of(fetchDashboardCount.failure(error.response)))
      );
    })
  );
};

export const fetchDevelopersGraphdataEpic: Epic<
  RootInputAction,
  RootOutputAction,
  RootState,
  APIDependencies
> = (action$, store$, { apis }) => {
  return action$.pipe(
    filter(isActionOf(fetchDeveloperGraphData.request)),
    switchMap(action => {
      const data = action.payload;
      return apis.fetchDevelopergraphData(data).pipe(
        mergeMap(response => {
          response.response.map((item: GraphData)=>{
           item.date = item.date__date
          })
          return of(
          
            fetchDeveloperGraphData.success(response.response),
          );
        }),
        catchError(error => of(fetchDeveloperGraphData.failure(error.response)))
      );
    })
  );
};

export const fetchEpic: Epic<
  RootInputAction,
  RootOutputAction,
  RootState,
  APIDependencies
> = (action$, store$, { apis }) => {
  return action$.pipe(
    filter(isActionOf(fetch.request)),
    switchMap(action => {
      const payload = action.payload;
      return apis.fetch(payload).pipe(
        mergeMap(response => {
          return of (fetch.success(response.response), 
          fetchGraphData.request({branch: action.payload.branch, year:action.payload.year}))
        }),
        catchError(error => of(fetch.failure(error.response)))
      );
    })
  );
};

export const addRepoEpic: Epic<
  RootInputAction,
  RootOutputAction,
  RootState,
  APIDependencies
> = (action$, store$, { apis }) => {
  return action$.pipe(
    filter(isActionOf(addRepo.request)),
    switchMap(action => {
      const payload = action.payload;
      return apis.addRepo(payload).pipe(
        mergeMap(response => {
          return of (addRepo.success(), 
          fetchRepositories.request())
        }),
        catchError(error => of(addRepo.failure(error.response)))
      );
    })
  );
};

export const fetchCommitsEpic: Epic<
  RootInputAction,
  RootOutputAction,
  RootState,
  APIDependencies
> = (action$, store$, { apis }) => {
  return action$.pipe(
    filter(isActionOf(fetchCommits.request)),
    switchMap(action => {
      const payload = action.payload;
      return apis.fetchCommits(payload).pipe(
        mergeMap(response => {
          return of (fetchCommits.success(response.response))
        }),
        catchError(error => of(fetchCommits.failure(error.response)))
      );
    })
  );
};
export const fetchDevCommitsEpic: Epic<
  RootInputAction,
  RootOutputAction,
  RootState,
  APIDependencies
> = (action$, store$, { apis }) => {
  return action$.pipe(
    filter(isActionOf(fetchDevCommits.request)),
    switchMap(action => {
      const payload = action.payload;
      return apis.fetchDevCommits(payload).pipe(
        mergeMap(response => {
          return of (fetchDevCommits.success(response.response))
        }),
        catchError(error => of(fetchDevCommits.failure(error.response)))
      );
    })
  );
};
export const fetchInactiveDevelopersEpic: Epic<
  RootInputAction,
  RootOutputAction,
  RootState,
  APIDependencies
> = (action$, store$, { apis }) => {
  return action$.pipe(
    filter(isActionOf(fetchInactiveDevelopers.request)),
    switchMap(action => {
      return apis.fetchInactiveDevelopers().pipe(
        mergeMap(response => {
          return of (fetchInactiveDevelopers.success(response.response))
        }),
        catchError(error => of(fetchInactiveDevelopers.failure(error.response)))
      );
    })
  );
};
export const archiveRepoEpic: Epic<
  RootInputAction,
  RootOutputAction,
  RootState,
  APIDependencies
> = (action$, store$, { apis }) => {
  return action$.pipe(
    filter(isActionOf(archiveRepo.request)),
    switchMap(action => {
      const payload = action.payload;
      return apis.archiveRepo(payload).pipe(
        mergeMap(response => {
          return of (archiveRepo.success(response.response))
        }),
        catchError(error => of(archiveRepo.failure(error.response)))
      );
    })
  );
};
export const fetchAllRepoEpic: Epic<
  RootInputAction,
  RootOutputAction,
  RootState,
  APIDependencies
> = (action$, store$, { apis }) => {
  return action$.pipe(
    filter(isActionOf(fetchAllRepo.request)),
    switchMap(action => {
      return apis.fetchAllRepo().pipe(
        mergeMap(response => {
          return of (fetchAllRepo.success(response.response), fetchDashboardCount.request(), fetchTopRepo.request({
            days: 7,
            top: 2,
          }))
        }),
        catchError(error => of(fetchAllRepo.failure(error.response)))
      );
    })
  );
};

export const LoginEpic = combineEpics(
  fetchRepositoriesEpic,
  fetchCurrentRepsoitoryEpic,
  fetchGraphdataEpic,
  fetchEpic,
  addRepoEpic,
  fetchCommitsEpic,
  fetchInactiveDevelopersEpic,
  archiveRepoEpic,
  fetchDevelopersEpic,
  fetchDevelopersGraphdataEpic,
  fetchDevCommitsEpic,
  fetchDevCommitsEpic,
  fetchDashboardCountEpic,
  fetchDevProjectsEpic,
  fetchTopReposEpic,
  fetchAllRepoEpic
);

export default LoginEpic;
