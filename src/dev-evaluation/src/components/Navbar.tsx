import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

interface Props {
 
}

const Navbar: React.FC<Props> = props => {

  return (
    <>
      <nav
            className={
              'navbar navbar-expand-lg navbar-dark bg-dark fixed-top no-border px-3'
            }
          >
            <div className='d-flex flex-row justify-content-between align-items-center w-100 '>
              <div className='navbar-brand'>
                <h4 className='brand'>
                  {' '}
                  Team Evaluator
                  {/* <img
                    src={require('../static/images/logo.svg').default}
                    style={{ height: '2rem' }}
                    alt="logo"
                  /> */}
                </h4>
              </div>
              <div className=" " id="navbarNav">
    <ul className="navbar-nav">
    <li className="nav-item px-2">
      <Link to="/" className='nav-link'>Dashboard</Link>
      </li>
      <li className="nav-item px-2">
      <Link to="/repositories/" className='nav-link'>Repositories</Link>
      </li>
      <li className="nav-item px-2">
      <Link to="/developers/" className='nav-link'>Developers</Link>
      </li>
    </ul>
  </div>
            </div>
          </nav>
    </>
  );
};

export default Navbar;
