import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
  const [activeLink, setActiveLink] = useState('/adminLayout/dashboard');

  const handleLinkClick = (path: string) => {
    setActiveLink(path);
  };
  return (
    <div>
      <UnorderedList>
        <ListItem active={activeLink === '/adminLayout/dashboard'}>
          <LinkValue
            to="/adminLayout/dashboard"
            onClick={() => handleLinkClick('/adminLayout/dashboard')}
          >
            Dashboard
          </LinkValue>
        </ListItem>
        <ListItem active={activeLink === '/adminLayout/users'}>
          <LinkValue
            to="/adminLayout/users"
            onClick={() => handleLinkClick('/adminLayout/users')}
          >
            User Management
          </LinkValue>
        </ListItem>
        <ListItem active={activeLink === '/adminLayout/products'}>
          <LinkValue
            to="/adminLayout/products"
            onClick={() => handleLinkClick('/adminLayout/products')}
          >
            Product Management
          </LinkValue>
        </ListItem>
        <ListItem active={activeLink === '/adminLayout/sales'}>
          <LinkValue
            to="/adminLayout/sales"
            onClick={() => handleLinkClick('/adminLayout/sales')}
          >
            Sales Report
          </LinkValue>
        </ListItem>
      </UnorderedList>
    </div>
  );
};

export default SideBar;
