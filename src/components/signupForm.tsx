import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../redux/store';
import { signup } from '../redux/slices/authSlice';
import styled from 'styled-components';
import {
  validateEmail,
  validatePassword,
} from '../utils/validation/validation';
import { IErrors, IFormData } from '../utils/type/types';

const SignupWrapper = styled.div`
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

const SignupFormContainer = styled.div`
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

const SignupForm: React.FC = () => {
  const [formData, setFormData] = useState<IFormData>({
    name: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<IErrors>({});
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const error = useSelector((state: RootState) => state.auth.error);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const validateForm = (): boolean => {
    const newErrors: IErrors = {};
    const { email, password } = formData;

    if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!validatePassword(password)) {
      newErrors.password =
        'Password must be at least 8 characters long, include one capital letter, and one special character.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await dispatch(signup(formData)).unwrap();
      navigate('/login');
    } catch (err) {
      console.error('Failed to signup:', err);
    }
  };

  return (
    <SignupWrapper>
      <SignupFormContainer>
        <Title>Signup Page</Title>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">Name:</label>
            <Input
              id="name"
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="email">Email:</label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {errors.email && <ErrorText>{errors.email}</ErrorText>}
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <Input
              id="password"
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {errors.password && <ErrorText>{errors.password}</ErrorText>}
          </div>
          <Button type="submit">Signup</Button>
          {error && <ErrorText>{error}</ErrorText>}
        </form>
      </SignupFormContainer>
    </SignupWrapper>
  );
};

export default SignupForm;
