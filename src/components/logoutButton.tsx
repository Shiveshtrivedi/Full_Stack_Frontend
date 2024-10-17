import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../redux/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import Loading from './loading';
import { EStatus } from '../utils/type/types';

const LogoutButton: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const status = useSelector((state: RootState) => state.products.status);
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      dispatch(logout());
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (status === EStatus.Loading) {
    return (
      <div>
        <p>
          <Loading />
        </p>
      </div>
    );
  }

  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
