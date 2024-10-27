import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import React, { useEffect, useState } from 'react';
import {
  fetchUsers,
  deleteUser,
  updateUser,
  updateUserInUserManagement,
  deleteUserInUserManagement,
  addUserInUserManagement,
} from '../../redux/slices/userManagementSlice';
import { IUserForAdmin } from '../../utils/type/types';
import styled from 'styled-components';
import { IoArrowBackOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import useScrollToTop from '../../hooks/useScrollToTop';
import ScrollToTopButton from '../ui/scrollButton';
import mqtt from 'mqtt';

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Roboto', sans-serif;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 15px;
  }
`;

const Title = styled.h1`
  text-align: center;
  color: #343a40;
  margin-bottom: 20px;
  font-size: 32px;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;

  thead {
    background-color: #343a40;
    color: #ffffff;
  }

  th,
  td {
    padding: 15px;
    text-align: left;
    border-bottom: 1px solid #dee2e6;
    font-size: 16px;

    @media (max-width: 768px) {
      padding: 10px;
      font-size: 14px;
    }
  }

  tr:nth-child(even) {
    background-color: #f2f2f2;
  }

  tr:hover {
    background-color: #e9ecef;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  border: 1px solid #ced4da;
  border-radius: 5px;
  transition: border-color 0.3s;

  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const Button = styled.button`
  padding: 10px 15px;
  margin: 0 5px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: #ffffff;
  font-size: 14px;
  cursor: pointer;
  transition:
    background-color 0.3s,
    transform 0.2s;

  &:hover {
    background-color: #0056b3;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    padding: 8px 12px;
    font-size: 12px;
  }
`;

const DeleteButton = styled(Button)`
  background-color: #dc3545;

  &:hover {
    background-color: #c82333;
  }
`;

const GoBackButton = styled(IoArrowBackOutline)`
  font-size: 25px;
  color: #000000;
  cursor: pointer;
  padding: 7px;

  &:hover {
    border-radius: 50%;
    background-color: #cbd3da;
  }
  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const UserManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const users = useSelector((state: RootState) => state.userManagement.users);
  const currentUserId = useSelector((state: RootState) => state.auth.user.id);
  const { isVisible, scrollToTop } = useScrollToTop(300);
  const loading = useSelector(
    (state: RootState) => state.userManagement.loading
  );
  const error = useSelector((state: RootState) => state.userManagement.error);

  const [editingUser, setEditingUser] = useState<IUserForAdmin | null>(null);
  const [userData, setUserData] = useState<IUserForAdmin>({
    userId: 0,
    userName: '',
    email: '',
    profileImage: '',
    isAdmin: false,
  });
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleEditClick = (user: IUserForAdmin) => {
    if (user.userId === currentUserId) {
      alert('You cannot edit you own profile');
      return;
    }

    if (user.email.endsWith('@intimetec.com')) {
      alert('Admin user cannot be edited.');
      return;
    }
    setEditingUser(user);
    setUserData({ ...user });
  };

  const handleSaveClick = () => {
    if (editingUser) {
      const updatedUser: IUserForAdmin = {
        userId: editingUser.userId,
        userName: userData.userName,
        email: userData.email,
        isAdmin: userData.isAdmin,
      };
      dispatch(updateUser(updatedUser));
      setEditingUser(null);
      setUserData({
        userId: 0,
        userName: '',
        email: '',
        profileImage: '',
        isAdmin: false,
      });
    }
  };

  const handleDeleteClick = (userId: number) => {
    dispatch(deleteUser(userId));
  };

  const websocketUrl = process.env.REACT_APP_WEBSOCKET_URL;

  useEffect(() => {
    const client = mqtt.connect(`${websocketUrl}`);

    client.on('connect', () => {
      client.subscribe('inventory-updates', (err) => {
        if (err) {
          console.error('Subscription error for inventory/updates:', err);
        }
      });

      client.subscribe('order/update', (err) => {
        if (err) {
          console.error('Subscription error for order/update:', err);
        }
      });
      client.subscribe('product/new', (err) => {
        if (err) {
          console.error('Subscription error for product/new:', err);
        }
      });
      client.subscribe('user/new', (err) => {
        if (err) {
          console.error('Subscription error for user/new :', err);
        }
      });
      client.subscribe('user/delete', (err) => {
        if (err) {
          console.error('Subscription error for user/delete :', err);
        }
      });
      client.subscribe('user/update', (err) => {
        if (err) {
          console.error('Subscription error for user/update :', err);
        }
      });
    });

    client.on('message', (topic, message) => {
      try {
        const data = JSON.parse(message.toString());
        if (topic === 'user/new') {
          dispatch(addUserInUserManagement(data));
        }
        if (topic === 'user/delete') {
          dispatch(deleteUserInUserManagement(data.userId));
        }
        if (topic === 'user/update') {
          dispatch(updateUserInUserManagement(data));
        }
      } catch (error) {
        console.error('Failed to parse message:', error);
      }
    });

    return () => {
      client.end();
    };
  }, [dispatch]);

  return (
    <Container>
      <GoBackButton onClick={() => navigate(-1)} />
      <Title>User Management</Title>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <StyledTable>
        <thead>
          <tr>
            <th>ID</th>
            <th>User Name</th>
            <th>Email</th>
            <th>Admin</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users && users.length > 0 ? (
            users.map((user) => (
              <tr key={user.userId}>
                <td>{user.userId}</td>
                <td>
                  {editingUser?.userId === user.userId ? (
                    <Input
                      value={userData.userName}
                      onChange={(e) =>
                        setUserData({ ...userData, userName: e.target.value })
                      }
                    />
                  ) : (
                    user.userName
                  )}
                </td>
                <td>
                  {editingUser?.userId === user.userId ? (
                    <Input
                      value={userData.email}
                      onChange={(e) =>
                        setUserData({ ...userData, email: e.target.value })
                      }
                    />
                  ) : (
                    user.email
                  )}
                </td>
                <td>
                  {editingUser?.userId === user.userId ? (
                    <Input
                      type="checkbox"
                      checked={userData.isAdmin}
                      onChange={(e) =>
                        setUserData({ ...userData, isAdmin: e.target.checked })
                      }
                    />
                  ) : user.isAdmin ? (
                    'Yes'
                  ) : (
                    'No'
                  )}
                </td>
                <td>
                  {editingUser?.userId === user.userId ? (
                    <Button onClick={handleSaveClick}>Save</Button>
                  ) : (
                    <Button
                      onClick={() => handleEditClick(user)}
                      disabled={
                        user.email.endsWith('@intimetec.com') ||
                        user.userId === currentUserId
                      }
                    >
                      Edit
                    </Button>
                  )}
                  <DeleteButton
                    onClick={() => handleDeleteClick(user.userId)}
                    disabled={user.isAdmin || user.userId === currentUserId}
                  >
                    Delete
                  </DeleteButton>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5}>No users found.</td>
            </tr>
          )}
        </tbody>
      </StyledTable>
      <ScrollToTopButton visible={isVisible} onClick={scrollToTop} />
    </Container>
  );
};

export default UserManagement;
