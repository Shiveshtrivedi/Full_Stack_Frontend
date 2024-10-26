import React from 'react';
import styled, { keyframes } from 'styled-components';

const fadeInOut = keyframes`
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  50% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-10px);
  }
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Message = styled.div.attrs({
  'aria-live': 'polite',
})`
  position: absolute;
  left: 50%;
  top: 50%;
  font-size: 24px;
  font-weight: bold;
  color: #6c757d;
  animation: ${fadeInOut} 3s infinite;
`;
const NoProductFound = () => (
  <Container>
    <Message>No Product Found</Message>
  </Container>
);

export default NoProductFound;
