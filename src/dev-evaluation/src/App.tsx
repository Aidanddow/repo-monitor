import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import Navbar from './components/Navbar';
import Analysis from './components/RepositoryAnalysis';
import Display from './components/DeveloperAnalysis';
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import * as actions from './actions';
import { useDispatch, useSelector } from 'react-redux';
import { RepositoryPayload, Store } from './types';
import { map, catchError, of } from 'rxjs';
import { ajax, AjaxResponse } from 'rxjs/ajax';
import { APIUrls, CORE_HOST } from './constants/urls';
import DevSidebar from './components/DevSidebar';
import DashboardRouter from './components/DashboardRouter';

function App() {
  const ConstructURL = (...params: any[]) => {
    return params.join('');
  };
 
  let location = useLocation();
  let {tab} = useParams();
  const dispatch = useDispatch();
  const repos: RepositoryPayload[] = useSelector((state: Store) => state.core.repositories);
  const developers = useSelector((state: Store) => state.core.developers);

  useEffect(() => {
    dispatch(actions.fetchRepositories.request());
  }, []);
 
  
  return (
    <div className="App">
 {repos.length&&location.pathname==="/repositories/" &&<Navigate to={"/repositories/" +  repos[0].id} replace/> }
 {developers.length&&location.pathname==="/developers/" &&<Navigate to={"/developers/" +  developers[0].id} replace/> }

 
      <Navbar/>
      <div className='d-flex vh-100'>
      {tab==='repositories'&& <Sidebar/>}
       {tab==='developers'&& <DevSidebar/>}
     
      {/* <div className='padding-top-6 h-100'> */}
      <div className='flex-grow-1'>
      <Routes>
      <Route path="repositories/:repo" element={<Analysis/>}/>
      <Route path="developers/:dev" element={<Display/>}/>
      <Route path="analysis/*" element={<DashboardRouter/>}/>
      <Route path="/" element={<DashboardRouter/>}/>
      {/* <Route
            path=':tab(archived)'
            element={<DashboardRouter/>} />    */}
      {/* <Route path="stale/" element={<DashboardRouter/>}/> */}
      </Routes></div>
      </div>
    </div>

  );
}

export default App;


