import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { IAdminRouteProps } from '../../utils/type/types';

const AdminRoute: React.FC<IAdminRouteProps> = ({ element }) => {
  const isAdmin = useSelector((state: RootState) => state.auth.isAdmin);
  return isAdmin ? element : <Navigate to="/login" />;
};

export default AdminRoute;
