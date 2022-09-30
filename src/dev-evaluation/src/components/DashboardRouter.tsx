import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import '../App.css';
import Archived from './Archived';
import Dashboard from './Dashboard';
import DashboardSidebar from './DashboardSidebar';
import InactiveDevelopers from './InactiveDevelopers';
import Stale from './Stale';
import * as actions from '../actions';
import { useDispatch } from 'react-redux';

interface Props {}

const Navbar: React.FC<Props> = (props) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(actions.fetchAllRepo.request());
    // dispatch(actions.fetchDashboardCount.request());
    // dispatch(
    //   actions.fetchTopRepo.request({
    //     days: 7,
    //     top: 2,
    //   })
    // );
  }, []);

  return (
    <div className='bg-grey vh-100 d-flex'>
      <DashboardSidebar />
      <div className='flex-grow-1 scroll'>
        <div className='mx-5 pt-6'>
    <Routes>
      <Route path="archived" element={<Archived/>}/>
      <Route path="stale" element={<Stale/>}/>

      <Route path="inactive-developers" element={<InactiveDevelopers/>}/>

      {/* <Route path="developers/:dev" element={<Display/>}/> */}
      <Route path="/" element={<Dashboard/>}/>

      </Routes>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
