import { Observable } from 'rxjs';
import { ajax, AjaxResponse } from 'rxjs/ajax';
import { APIUrls, CORE_HOST } from '../constants/urls';
import {
  LoginPayload,
  SignupPayload,
  Email,
  ForgotPassword,
  RepositoryPayload,
  GraphDataRequest,
  FetchRequest,
  AddRepo,
  FetchCommits,
  DeveloperGraphDataRequest,
  FetchDevCommits,
  TopRepoPayload,
  ArchiveRepo,
} from '../types';
import {
  getConfig,
  postConfigWithoutToken,
  postConfig,
  deleteConfig,
  patchConfig
} from './ApiConfig';
export interface APIDependencies {
  apis: ProjectApis;
}
interface ProjectApis {
  // login apis
  login: (data: LoginPayload) => Observable<AjaxResponse<any>>;
  profile: () => Observable<AjaxResponse<any>>;
  signup: (data: SignupPayload) => Observable<AjaxResponse<any>>;
  resetPassword: (data: Email) => Observable<AjaxResponse<any>>;
  resetConfirmPassword: (data: ForgotPassword) => Observable<AjaxResponse<any>>;
  logout: () => Observable<AjaxResponse<any>>;
  fetchRepositories: () => Observable<AjaxResponse<RepositoryPayload[]>>;
  fetchCurrentRepository: (data: string) => Observable<AjaxResponse<any>>;
  graphData: (data: GraphDataRequest) => Observable<AjaxResponse<any>>;
  fetch:  (data: FetchRequest) => Observable<AjaxResponse<any>>;
  addRepo: (data: AddRepo) => Observable<AjaxResponse<any>>;
  fetchCommits: (data: FetchCommits) => Observable<AjaxResponse<any>>;
  fetchDevelopers: () => Observable<AjaxResponse<any>>;
  fetchDevelopergraphData: (data: DeveloperGraphDataRequest ) => Observable<AjaxResponse<any>>;
  fetchDevCommits: (data: FetchDevCommits) => Observable<AjaxResponse<any>>;
  fetchTopRepos:  (data: TopRepoPayload) => Observable<AjaxResponse<any>>;
  fetchDevProjects:  (data: number) => Observable<AjaxResponse<any>>;
  fetchDashboardCount:  () => Observable<AjaxResponse<any>>;
  fetchInactiveDevelopers: () => Observable<AjaxResponse<any>>;
  archiveRepo: (data: ArchiveRepo) => Observable<AjaxResponse<any>>;
  fetchAllRepo: () => Observable<AjaxResponse<any>>;
}
const ConstructURL = (...params: any[]) => {
  return params.join('');
};

let token: string = '';
export const setToken = (authToken: string) => {
  token = authToken;
};

// const csrf = localStorage.getItem("B");
// let csrfToken: string = "";
// if (csrf === null) {
//   csrfToken = "";
// } else {
//   csrfToken = csrf;
// }
// log("csrf", csrfToken);

const ProjectApis: ProjectApis = {
  // login apis
  login: data =>
    ajax(postConfigWithoutToken(ConstructURL(CORE_HOST, APIUrls.login), data)),
  resetPassword: data =>
    ajax(
      postConfigWithoutToken(
        ConstructURL(CORE_HOST, APIUrls.resetPassword),
        data
      )
    ),
  resetConfirmPassword: data =>
    ajax(
      postConfigWithoutToken(
        ConstructURL(CORE_HOST, APIUrls.confirmResetPassword),
        data
      )
    ),
  logout: () =>
    ajax(postConfig(ConstructURL(CORE_HOST, APIUrls.logout), '', token)),
  signup: data =>
    ajax(postConfigWithoutToken(ConstructURL(CORE_HOST, APIUrls.signup), data)),
 
  profile: () =>
    ajax(getConfig(ConstructURL(CORE_HOST, APIUrls.profile), token)),


  fetchRepositories: () => ajax(getConfig(ConstructURL(CORE_HOST, APIUrls.repos), token)),
  fetchDevelopers: () => ajax(getConfig(ConstructURL(CORE_HOST, APIUrls.fetchdevelopers), token)),
  fetchCurrentRepository: (data: string) => ajax(getConfig(ConstructURL(CORE_HOST, APIUrls.current_repository, data, "/"), token)),
  fetchDevelopergraphData: (data: DeveloperGraphDataRequest) =>ajax(getConfig(ConstructURL(CORE_HOST, APIUrls.fetchdeveloperGraphData, data.author, "/", data.year), token)),
  graphData: (data: GraphDataRequest) => ajax(getConfig(ConstructURL(CORE_HOST, APIUrls.graphData, data.branch, "/", data.year), token)),
  fetch:  (data: FetchRequest) => ajax(postConfig(ConstructURL(CORE_HOST, APIUrls.fetch), data, token)),
  addRepo: (data: AddRepo) => ajax(postConfig(ConstructURL(CORE_HOST, APIUrls.addRepo), data, token)),
  fetchCommits: (data: FetchCommits) => ajax(getConfig(ConstructURL(CORE_HOST, APIUrls.fetchCommits, data.branch, "/", data.date), token)),
  fetchDevCommits: (data: FetchDevCommits) => ajax(getConfig(ConstructURL(CORE_HOST, APIUrls.fetchDevCommits, data.author, "/", data.date), token)),
  fetchTopRepos:  (data: TopRepoPayload) => ajax(getConfig(ConstructURL(CORE_HOST, APIUrls.fetchTopRepo, data.days, "/", data.top), token)),
  fetchDevProjects:  (data: number) => ajax(getConfig(ConstructURL(CORE_HOST, APIUrls.fetchdevelopers, data), token)),
  fetchDashboardCount:  () => ajax(getConfig(ConstructURL(CORE_HOST, APIUrls.fetchDashboardCount), token)),
  fetchInactiveDevelopers:() => ajax(getConfig(ConstructURL(CORE_HOST, APIUrls.fetchInactiveDevelopers), token)),
  archiveRepo: (data: ArchiveRepo) => ajax(patchConfig(ConstructURL(CORE_HOST, APIUrls.current_repository, data.id, '/'),data, token)),
  fetchAllRepo: () => ajax(getConfig(ConstructURL(CORE_HOST, APIUrls.fetchRepo), token)),
  
};
export const ProjectDependencies: APIDependencies = {
  apis: ProjectApis
};
