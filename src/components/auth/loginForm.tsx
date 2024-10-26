import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { RootState, AppDispatch } from '../../redux/store';
import styled from 'styled-components';
import { initializeOrders } from '../../redux/slices/orderSlice';
import { getCart } from '../../redux/slices/cartSlice';

const LoginWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f4f4f9;
  padding: 20px;

  @media (max-width: 768px) {
    padding: 15px;
  }

  @media (max-width: 480px) {
    padding: 10px;
  }
`;

const LoginFormContainer = styled.div`
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px #00000050;
  padding: 20px;
  width: 100%;
  max-width: 400px;

  @media (max-width: 768px) {
    padding: 15px;
    max-width: 90%;
  }

  @media (max-width: 480px) {
    padding: 10px;
    max-width: 95%;
  }
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    font-size: 24px;
  }

  @media (max-width: 480px) {
    font-size: 20px;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;

  &:focus {
    border-color: #007bff;
    outline: none;
  }

  @media (max-width: 768px) {
    padding: 8px;
    margin-bottom: 12px;
  }

  @media (max-width: 480px) {
    padding: 6px;
    margin-bottom: 10px;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }

  @media (max-width: 768px) {
    padding: 8px;
    font-size: 14px;
  }

  @media (max-width: 480px) {
    padding: 6px;
    font-size: 12px;
  }
`;

const ErrorText = styled.p`
  color: #ff0000;
  text-align: center;
  margin-top: 10px;

  @media (max-width: 768px) {
    font-size: 14px;
  }

  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const error = useSelector((state: RootState) => state.auth.error);

  const handleLoginSuccess = (user: any) => {
    dispatch(getCart({ userId: user.user.id }));
    dispatch(initializeOrders(user.token));
    navigate('/');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const user = await dispatch(login({ email, password })).unwrap();
      handleLoginSuccess(user);
    } catch (err) {
      console.error('Failed to login:', err);
    }
  };

  return (
    <LoginWrapper>
      <LoginFormContainer>
        <Title>Login Page</Title>
        <form onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit">Submit</Button>
          {error && <ErrorText>{error}</ErrorText>}
        </form>
      </LoginFormContainer>
    </LoginWrapper>
  );
};

export default LoginForm;
