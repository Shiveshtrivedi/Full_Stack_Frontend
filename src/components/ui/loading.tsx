import React from 'react';
import styled, { keyframes } from 'styled-components';

const Bounce = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-30px);
  }
  60% {
    transform: translateY(-15px);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
  position: relative;
`;

const Dot = styled.div`
  width: 20px;
  height: 20px;
  margin: 0 10px;
  border-radius: 50%;
  background-color: #3498db;
  animation: ${Bounce} 1.4s infinite ease-in-out;

  &:nth-child(2) {
    animation-delay: -0.32s;
  }

  &:nth-child(3) {
    animation-delay: -0.16s;
  }
`;

const Loading: React.FC = () => {
  return (
    <LoadingContainer>
      <Dot></Dot>
      <Dot></Dot>
      <Dot></Dot>
    </LoadingContainer>
  );
};

export default Loading;
