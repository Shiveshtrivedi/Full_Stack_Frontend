import React from 'react';
import styled, { keyframes } from 'styled-components';

const drawTick = keyframes`
  0% {
    stroke-dasharray: 80;
    stroke-dashoffset: 80;
  }
  100% {
    stroke-dasharray: 80;
    stroke-dashoffset: 0;
  }
`;

const appear = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.5);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
`;

const Checkmark = styled.svg`
  width: 100px;
  height: 100px;
  .check {
    stroke: #4caf50;
    stroke-width: 6;
    stroke-linecap: round;
    stroke-linejoin: round;
    fill: none;
    stroke-dasharray: 80;
    stroke-dashoffset: 80;
    animation: ${drawTick} 0.5s ease forwards;
  }
  .circle {
    stroke: #4caf50;
    stroke-width: 6;
    fill: none;
    opacity: 0;
    animation: ${appear} 0.5s ease forwards;
    animation-delay: 0.4s;
  }
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #e8f5e9;
`;

const SuccessTickAnimation = () => (
  <Container>
    <Checkmark viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle className="circle" cx="50" cy="50" r="45" />
      <path className="check" d="M20 50 l20 20 l40 -40" />
    </Checkmark>
  </Container>
);

export default SuccessTickAnimation;
