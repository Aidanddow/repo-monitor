import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { APIStatus, Store } from '../types';

export function RequireAuth({ children }: { children: JSX.Element }) {
    // const is_authenticated  = useSelector((state: Store) => state.login.loaders.login);
    const is_authenticated  = APIStatus.success;
    let location = useLocation();
  
    if (is_authenticated !== APIStatus.success) {
      // Redirect them to the /login page, but save the current location they were
      // trying to go to when they were redirected. This allows us to send them
      // along to that page after they login, which is a nicer user experience
      // than dropping them off on the home page.
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  
    return children;
  }