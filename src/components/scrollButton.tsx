
import React from 'react';
import styled from 'styled-components';
import { FaArrowUp } from 'react-icons/fa';

const ScrollButton = styled(FaArrowUp)<{ visible: boolean }>`
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: ${(props) => (props.visible ? 'block' : 'none')};
  border: none;
  cursor: pointer;
  padding: 7px;
  font-size: 25px;
  z-index: 10;

  &:hover {
    background-color: #cbd3da;
    border-radius: 50%;
    box-shadow: 0 4px 8px #00000020;
    transition: opacity 0.3s ease-in-out;
  }
`;

interface ScrollButtonProps {
  visible: boolean;
  onClick: () => void;
}

const ScrollToTopButton: React.FC<ScrollButtonProps> = ({ visible, onClick }) => {
  return <ScrollButton visible={visible} onClick={onClick} />;
};

export default ScrollToTopButton;
