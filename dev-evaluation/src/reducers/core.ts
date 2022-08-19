import { combineReducers } from 'redux';
import { getType } from 'typesafe-actions';
import * as actions from '../actions';
import { setToken } from '../api';
import {
  APIStatus,
  ProjectReduxActions,
  RepositoryPayload,
  BranchPayload,
  GraphData,
  Commits,
  Developer,
  DashboardCount,
  DevProject,
  TopRepoPayload,
  DashboardGraphData,
  DevCommits} from '../types';
import { setLocalStorage } from '../utils';
export interface LoginState {
  
  loaders: Loaders;
  repositories:  RepositoryPayload[];
  currentRepostory: RepositoryPayload;
  branches: BranchPayload[];
  graphData: GraphData[];
  commits: Commits[];
  developers: Developer[];
  developerGraphData: GraphData[];
  inactiveDevelopers: Developer[];
  devCommits: DevCommits[];
  dashboardCount: DashboardCount;
  devProjects: DevProject[];
  topRepos: DashboardGraphData[];
}

interface Loaders {
  fetchAllRepos: APIStatus;
  addRepo: APIStatus;
}
const InitialcurrentRepostory = {

    id: 0,
    repo_path: '',
    repo_name: '',
    developers: [],
    last_authored_date: '',
    start_date: '',
    archived: false

}
const dashboardCountData: DashboardCount = {
repositories_count: 0,
developers_count: 0,
stale_repositories_count: 0,
archived_repositories: 0,
inactive_developers: 0,


}
export const defaultLoaders: Loaders = {
    fetchAllRepos: APIStatus.uninitiated,
    addRepo: APIStatus.uninitiated,
    
};

export default combineReducers<LoginState, ProjectReduxActions>({
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
      case getType(actions.fetchAllRepo.request): {
        return { ...state, fetchAllRepos: APIStatus.progress };
      }
      case getType(actions.fetchAllRepo.success): {
        return { ...state, fetchAllRepos: APIStatus.success };
      }
      case getType(actions.fetchAllRepo.failure): {
        return { ...state, fetchAllRepos: APIStatus.failed };
      }
      case getType(actions.addRepo.request): {
        return { ...state, addRepo: APIStatus.progress };
      }
      case getType(actions.addRepo.success): {
        return { ...state, addRepo: APIStatus.success };
      }
      case getType(actions.addRepo.failure): {
        return { ...state, addRepo: APIStatus.failed };
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
  repositories: (state = [], action) => {
    switch (action.type) {
      case getType(actions.fetchRepositories.success): {
        return action.payload;
      }
      case getType(actions.archiveRepo.success): {
        return action.payload;
      }
      case getType(actions.fetchCurrentRepository.success): {
        const currentRepositories = state.map(item=>
          {
            if(item.id===action.payload.repository.id){
              item.archived = action.payload.repository.archived
              item.last_authored_date = action.payload.repository.last_authored_date

            }
            return item
          })
          return currentRepositories

      }
      default:
        return state;
    }
  },
  currentRepostory: (state = InitialcurrentRepostory , action) => {
    switch (action.type) {
      case getType(actions.fetchCurrentRepository.success): {
        return action.payload.repository;
      }
      default:
        return state;
    }
  },
  developers: (state = [], action) => {
    switch (action.type) {
      case getType(actions.fetchDevelopers.success): {
        return action.payload;
      }
      default:
        return state;
    }
  },
  inactiveDevelopers: (state = [], action) => {
    switch (action.type) {
      case getType(actions.fetchInactiveDevelopers.success): {
        return action.payload;
      }
      default:
        return state;
    }
  },
  branches: (state = [], action) => {
    switch (action.type) {
      case getType(actions.fetchCurrentRepository.success): {
        return action.payload.branches;
      }
      default:
        return state;
    }
  },
  commits: (state = [], action) => {
    switch (action.type) {
      case getType(actions.fetchCommits.success): {
        return action.payload;
      }
      default:
        return state;
    }
  },
  devCommits:  (state = [], action) => {
    switch (action.type) {
      case getType(actions.fetchDevCommits.success): {
        return action.payload;
      }
      default:
        return state;
    }
  },
  graphData: (state = [], action) => {
    switch (action.type) {
      case getType(actions.fetchGraphData.success): {
        return action.payload;
      }
      default:
        return state;
    }
  },
  developerGraphData: (state = [], action) => {
    switch (action.type) {
      case getType(actions.fetchDeveloperGraphData.success): {
        return action.payload;
      }
      default:
        return state;
    }
  },
  dashboardCount: (state = dashboardCountData, action) => {
    switch (action.type) {
      case getType(actions.fetchDashboardCount.success): {
        return action.payload;
      }
      default:
        return state;
    }
  },
  devProjects: (state = [], action) => {
    switch (action.type) {
      case getType(actions.fetchDevProjects.success): {
        console.log("enteredabdhclhjsbdc")
        return action.payload;
      }
      default:
        return state;
    }
  },
  topRepos: (state = [], action) => {
    switch (action.type) {
      case getType(actions.fetchTopRepo.success): {
        return action.payload;
      }
      default:
        return state;
    }
  },
});
