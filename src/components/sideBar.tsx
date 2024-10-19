import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const UnorderedList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin-top: 50px;
`;

const ListItem = styled.li<{ active: boolean }>`
  padding: 10px 1px;
  background-color: ${(props) => (props.active ? '#e8c995' : 'transparent')};
  width: 100%;
  padding-left: 50px;

  &:hover {
    background-color: #e8c995;
  }
`;

const LinkValue = styled(Link)`
  text-decoration: none;
  display: block;
  heigth: 100%;
  color: #f0f0f0;
`;

const SideBar = () => {

  const location = useLocation();

  return (
    <div>
      <UnorderedList>
        <ListItem
          active={
            location.pathname === '/adminLayout/dashboard' ||
            location.pathname === '/adminLayout'
          }
        >
          <LinkValue
            to="/adminLayout/dashboard"
          >
            Dashboard
          </LinkValue>
        </ListItem>
        <ListItem active={location.pathname === '/adminLayout/users'}>
          <LinkValue
            to="/adminLayout/users"
          >
            User Management
          </LinkValue>
        </ListItem>
        <ListItem active={location.pathname === '/adminLayout/products'}>
          <LinkValue
            to="/adminLayout/products"
          >
            Product Management
          </LinkValue>
        </ListItem>
        <ListItem active={location.pathname === '/adminLayout/sales'}>
          <LinkValue
            to="/adminLayout/sales"
          >
            Sales Report
          </LinkValue>
        </ListItem>
      </UnorderedList>
    </div>
  );
};

export default SideBar;
