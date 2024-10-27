import React from 'react';
import styled, { keyframes } from 'styled-components';

const shakeAnimation = keyframes`
  0% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  50% { transform: translateX(10px); }
  75% { transform: translateX(-10px); }
  100% { transform: translateX(0); }
`;

const spinAnimation = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f5f5f5;
`;

const ErrorMessage = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #d9534f;
  animation: ${shakeAnimation} 1s infinite;
  margin-bottom: 20px;
`;

const Spinner = styled.div`
  border: 8px solid #f3f3f3;
  border-top: 8px solid #d9534f;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: ${spinAnimation} 1s linear infinite;
`;

const NetworkErrorPage = () => {
  return (
    <Container>
      <ErrorMessage>Network Error</ErrorMessage>
      <Spinner />
    </Container>
  );
};

export default NetworkErrorPage;
