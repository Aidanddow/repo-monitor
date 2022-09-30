import { createAsyncAction, createAction } from 'typesafe-actions';
import * as constants from '../constants';
import { AddRepo, ArchiveRepo, BranchPayload, Commits, CurrentRepositoryPayload, DashboardCount, DashboardGraphData, DevCommits, Developer, DeveloperGraphDataRequest, DevProject, FetchCommits, FetchDevCommits, FetchRequest, GraphData, GraphDataRequest, RepositoryPayload, TopRepoPayload } from '../types/core';

export const fetchRepositories = createAsyncAction(
    constants.FETCH_REPOSITORIES_REQUEST,
    constants.FETCH_REPOSITORIES_SUCCESS,
    constants.FETCH_REPOSITORIES_FAILURE
  )<void, RepositoryPayload[] , Error>();

export const fetchCurrentRepository = createAsyncAction(
  constants.FETCH_CURRENT_REPOSITORY_REQUEST,
  constants.FETCH_CURRENT_REPOSITORY_SUCCESS,
  constants.FETCH_CURRENT_REPOSITORY_FAILURE
)<string, CurrentRepositoryPayload , Error>();

export const fetchGraphData = createAsyncAction(
    constants.FETCH_GRAPHDATA_REQUEST,
    constants.FETCH_GRAPHDATA_SUCCESS,
    constants.FETCH_GRAPHDATA_FAILURE
  )<GraphDataRequest, GraphData[] , Error>();

  export const fetch = createAsyncAction(
    constants.FETCH_REQUEST,
    constants.FETCH_SUCCESS,
    constants.FETCH_FAILURE
  )<FetchRequest, void , Error>();

  export const addRepo = createAsyncAction(
    constants.ADD_REPO_REQUEST,
    constants.ADD_REPO_SUCCESS,
    constants.ADD_REPO_FAILURE
  )<AddRepo, void , Error>();

  export const fetchCommits = createAsyncAction(
    constants.FETCH_COMMITS_REQUEST,
    constants.FETCH_COMMITS_SUCCESS,
    constants.FETCH_COMMITS_FAILURE
  )<FetchCommits, Commits[] , Error>();

  export const fetchDevProjects = createAsyncAction(
    constants.FETCH_DEVPROJECTS_REQUEST,
    constants.FETCH_DEVPROJECTS_SUCCESS,
    constants.FETCH_DEVPROJECTS_FAILURE
  )<number, DevProject[] , Error>();
  export const fetchDashboardCount = createAsyncAction(
    constants.FETCH_DASHBOARD_COUNT_REQUEST,
    constants.FETCH_DASHBOARD_COUNT_SUCCESS,
    constants.FETCH_DASHBOARD_COUNT_FAILURE
  )<void, DashboardCount , Error>();
  export const fetchTopRepo = createAsyncAction(
    constants.FETCH_TOP_REPOS_REQUEST,
    constants.FETCH_TOP_REPOS_SUCCESS,
    constants.FETCH_TOP_REPOS_FAILURE
  )<TopRepoPayload, DashboardGraphData[] , Error>();

  export const fetchDevCommits = createAsyncAction(
    constants.FETCH_DEV_COMMITS_REQUEST,
    constants.FETCH_DEV_COMMITS_SUCCESS,
    constants.FETCH_DEV_COMMITS_FAILURE
  )<FetchDevCommits, DevCommits[] , Error>();


  export const fetchDevelopers = createAsyncAction(
    constants.FETCH_DEVELOPERS_REQUEST,
    constants.FETCH_DEVELOPERS_SUCCESS,
    constants.FETCH_DEVELOPERS_FAILURE
  )<void, Developer[], Error>();

  export const fetchInactiveDevelopers = createAsyncAction(
    constants.FETCH_INACTIVE_DEVELOPERS_REQUEST,
    constants.FETCH_INACTIVE_DEVELOPERS_SUCCESS,
    constants.FETCH_INACTIVE_DEVELOPERS_FAILURE
  )<void, Developer[], Error>();

  export const archiveRepo = createAsyncAction(
    constants.ARCHIVE_REPO_REQUEST,
    constants.ARCHIVE_REPO_SUCCESS,
    constants.ARCHIVE_REPO_FAILURE
  )<ArchiveRepo, RepositoryPayload[], Error>();

  export const fetchAllRepo = createAsyncAction(
    constants.FETCH_ALL_REPO_REQUEST,
    constants.FETCH_ALL_REPO_SUCCESS,
    constants.FETCH_ALL_REPO_FAILURE
  )<void, void, Error>();

  
  export const fetchDeveloperGraphData = createAsyncAction(
    constants.FETCH_DEVELOPERS_GRAPHDATA_REQUEST,
    constants.FETCH_DEVELOPERS_GRAPHDATA_SUCCESS,
    constants.FETCH_DEVELOPERS_FAILURE
  )<DeveloperGraphDataRequest, GraphData[] , Error>();

