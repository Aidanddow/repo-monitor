import { BrowserRouter as Router, Route, Routes, Navigate, RouteProps, useLocation } from 'react-router-dom';
import React, { ComponentClass, FunctionComponent } from 'react';
import Login from './DeveloperAnalysis';
import { history } from '../configureStore';
import { APIStatus, Store } from '../types';
import App from '../App';
import { useSelector } from 'react-redux';
import { RequireAuth } from './RequiredAuth';

const Base = () => {


  return (
    <Router>
      <Routes>
            <Route path='/login/*' element={<Login/>} />
            <Route
            path='/'
            element={
                <App />
            }
          >
          <Route
            path=':tab/*'
            element={
                <App />
            }
          />
          </Route>
            
            {/* <PrivateRoute
              {...props}
              Component={App}
              isAuthenticated={props.isAuthenticated}
              path='/:item(home|email-signature|events|calendar)/*'
            /> */}
        
        </Routes>
           
           
       
    </Router>
  );
};

export default Base;
