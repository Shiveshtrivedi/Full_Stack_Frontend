import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { IoArrowBackOutline } from 'react-icons/io5';

const StyledGoBackButton = styled(IoArrowBackOutline)`
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

const GoBackButton: React.FC = () => {
  const navigate = useNavigate();

  return (
    <StyledGoBackButton onClick={() => navigate(-1)} />
  );
};

export default GoBackButton;
