import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

const ProtectedRoute = ({ children, role }) => {
  const { isLoggedIn, user } = useContext(AuthContext);

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
