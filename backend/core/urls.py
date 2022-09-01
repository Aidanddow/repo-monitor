from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter


from core.serializers import RepositorySerializer
from .views import AddRepositoryViewSet, BranchViewSet, CommitDetailView, CurrentUserView, DashboardCount, DeveloperCommitDetailView, DeveloperDetailView, DeveloperGraphView, DeveloperListViewSet, FetchInactiveDevelopers, FetchRepositories, GraphDatabyYear, FetchBranchViewSet, RepositoryDetailViewSet, RepositoryListViewSet, TopRepositories
# from rest_framework import routers


router = DefaultRouter()
router.register(r'add-repo', AddRepositoryViewSet, basename="repo")
router.register(r'fetch-branch', FetchBranchViewSet, basename="fetch")
router.register(r'branches', BranchViewSet, basename="branches")
router.register(r'repositories', RepositoryListViewSet, basename="repos")
router.register(r'repository', RepositoryDetailViewSet, basename="repo_detail")
router.register(r'developers', DeveloperListViewSet, basename="developers")


urlpatterns = [

    path('', include(router.urls)),

    path('developer-graph/<str:author>/<int:year>/',
         DeveloperGraphView.as_view()),
    path('graph-data/<str:branch>/<int:year>/', GraphDatabyYear.as_view()),
    path('commits/<str:branch>/<str:date>/', CommitDetailView.as_view()),
    path('dev-commits/<str:author>/<str:date>/',
         DeveloperCommitDetailView.as_view()),
    path('dashboard/', DashboardCount.as_view()),
    path('developers/<int:developer>/', DeveloperDetailView.as_view()),
    path('top-repositories/<int:days>/<int:top>', TopRepositories.as_view()),
    path('inactive-developers/', FetchInactiveDevelopers.as_view()),
    path('profile/', CurrentUserView.as_view(), name='profile'),
    path('fetch/', FetchRepositories.as_view(), name='fetch'),


]
