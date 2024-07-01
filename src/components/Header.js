import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

import './Header.css'

const Header = () => {
  const { user, logoutUser } = useContext(AuthContext);

  const loginComp = (
    <Link to='/login' className='headerLink'>Login</Link>
  )

  const registerComp = (
    <Link to='/register' className='headerLink'>Register</Link>
  )

  const homeComp = (
    <Link className='headerLink' to='/'>Home</Link>
  )

  const adminPanel = (
    <Link to='/admin' className='headerLink'>Admin</Link>
  )

  const logoutComp = (
    <span onClick={logoutUser}>Logout</span>
  )

  return (
    <div className="header">
      <div className="header-left">
        {user && <span>Hello {user.name}!</span>}
      </div>
      <div className="header-right">
        {user ? <span>{homeComp} {user.is_admin && <span>{adminPanel}</span>} {logoutComp}</span> : <span>{loginComp} {registerComp}</span>}
      </div>
    </div>
  );
};

export default Header;
