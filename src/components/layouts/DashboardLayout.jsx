import React, { useContext } from 'react'
import { userContext } from '../../context/userContext';
import NavBar from './NavBar';

const DashboardLayout = ({ children }) => {
  const { user } = useContext(userContext);

  return (
    <div>
        <NavBar />
        {user && <div>{children}</div>}
    </div>
  )
}

export default DashboardLayout