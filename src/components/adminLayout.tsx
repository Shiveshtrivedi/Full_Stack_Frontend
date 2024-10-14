import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import SideBar from './sideBar';
import { RiMenuFold2Fill, RiMenuUnfold4Fill } from 'react-icons/ri';
import { toggleSidebar } from '../redux/slices/adminLayoutSlice';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  margin-left: 0;
  padding: 0;
  transition: margin-left 0.3s ease;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SidebarContainer = styled.div<{ isOpen: boolean }>`
  width: ${({ isOpen }) => (isOpen ? '250px' : '0')};
  padding: 0;
  margin: 0;
  transition: width 0.3s ease;
  overflow: hidden;
  background-color: #343a40;
  color: #ffffff;

  @media (max-width: 768px) {
    width: 100%;
    height: auto;
  }
`;

const ContentContainer = styled.div`
  flex: 1;
  padding: 20px;
  background-color: #f8f9fa;
  transition: margin-left 0.3s ease;

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const ToggleButton = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  font-size: 24px;
  cursor: pointer;
  color: #343a40;

  @media (max-width: 768px) {
    left: 10px;
  }
`;

const AdminLayout = () => {
  const isSidebarOpen = useSelector(
    (root: RootState) => root.adminLayout.isSidebarOpen
  );
  const dispatch = useDispatch();

  return (
    <LayoutContainer>
      <ToggleButton onClick={() => dispatch(toggleSidebar())}>
        {isSidebarOpen ? (
          <RiMenuFold2Fill style={{ marginTop: '130px' }} />
        ) : (
          <RiMenuUnfold4Fill style={{ marginTop: '130px' }} />
        )}
      </ToggleButton>
      <SidebarContainer isOpen={isSidebarOpen}>
        {isSidebarOpen && <SideBar />}
      </SidebarContainer>
      <ContentContainer>
        <Outlet />
      </ContentContainer>
    </LayoutContainer>
  );
};

export default AdminLayout;
