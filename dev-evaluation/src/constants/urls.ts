// export const CORE_HOST = 'http://localhost:8000';
export const CORE_HOST = '';
export enum APIUrls {
  login = '/auth/login/',
  logout = '/auth/logout/',
  profile = '/core/profile/',
  googleLogin = '/auth/google/',
  resetPassword = '/auth/password/reset/',
  confirmResetPassword = '/auth/password/reset/confirm/',
  signup = '/auth/registration/',
  current_repository = '/core/repository/',
  repos = '/core/repositories/',
  graphData = '/core/graph-data/',
  fetch = '/core/fetch-branch/',
  addRepo = '/core/add-repo/',
  fetchCommits = '/core/commits/',
  fetchdevelopers = '/core/developers/',
  fetchdeveloperGraphData = '/core/developer-graph/',
  fetchDevCommits = '/core/dev-commits/',
  fetchDashboardCount = '/core/dashboard/',
  fetchTopRepo = '/core/top-repositories/',
  fetchInactiveDevelopers = '/core/inactive-developers/',
  fetchRepo = '/core/fetch/',
  // path('dashboard/', DashboardCount.as_view()),
  //   path('developers/<str:developer>/', DeveloperDetailView.as_view()),
  //   path('top-repositories/<int:days>/<int:top>', TopRepositories.as_view()),
  // path('graph-data/<str:branch>/<int:year>/', GraphDatabyYear.as_view()),

  // addTextContents = "/contents/text_content/"
}
