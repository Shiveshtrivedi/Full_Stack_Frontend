import React, { useState } from 'react';
import styled from 'styled-components';
import { RootState } from '../redux/store';
import { useSelector } from 'react-redux';
import { BsCart } from 'react-icons/bs';
import { Link } from 'react-router-dom';

const HeaderWrapper = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 28px 25px;
  background-color: #e8c995;
  box-shadow: 0 2px 4px #00000020;
  transition: background-color 0.3s ease;
  position: relative;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 20px 15px;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  font-size: 25px;
  font-weight: bold;

  @media (max-width: 768px) {
    font-size: 20px;
    margin-bottom: 10px;
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: 10px;
  flex-grow: 1;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
  }
`;

const UserActions = styled.div`
  display: flex;
  gap: 10px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const StyledLink = styled(Link)`
  color: #333333;
  text-decoration: none;
  margin: 5px;
  font-size: 100%;

  &:hover {
    color: #555555;
    text-decoration: underline;
  }
`;

const CartIcon = styled(BsCart)`
  font-size: 34px;
  color: #333333;
  transition: color 0.3s ease;
  cursor: pointer;

  &:hover {
    color: #555555;
  }

  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

const CartItems = styled.span`
  position: absolute;
  top: -3px;
  right: 0px;
  background-color: #ff0000;
  color: #fefefe;
  border-radius: 50%;
  padding: 4px 6px;
  font-size: 12px;
  font-weight: bold;
  line-height: 1;
  text-align: center;
  min-width: 12px;
`;

const CartContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;

  @media (max-width: 768px) {
    width: 100%;
    text-align: center;
  }
`;

const DropdownButton = styled.button`
  background-color: #e8c995;
  border: none;
  color: #333333;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 4px;

  &:hover {
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 12px 0;
  }
`;

const DropdownMenu = styled.div<{ isOpen: boolean }>`
  display: ${(props) => (props.isOpen ? 'block' : 'none')};
  position: absolute;
  top: 100%;
  left: 0;
  background-color: #ffffff;
  border: 1px solid #cccccc;
  border-radius: 4px;
  box-shadow: 0 2px 4px #00000050;
  width: 200px;
  z-index: 1000;

  @media (max-width: 768px) {
    width: 100%;
    left: 0;
    top: 100%;
  }
`;

const DropdownItem = styled(Link)`
  display: block;
  color: #333333;
  padding: 10px 15px;
  text-decoration: none;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const DropdownContainerHover = styled(DropdownContainer)`
  &:hover ${DropdownMenu} {
    display: block;
  }
`;

const ImageLogo = styled.div`
  display: flex;
  align-items: center;
  font-size: 24px;
  font-weight: 600;
  color: #333;
  transition: color 0.3s ease;
  text-transform: uppercase;

  img {
    height: 80px;
    width: 80px;
    margin-right: 12px;
    border-radius: 50%;
    box-shadow: 0 4px 6px #00000050;
  }

  &:hover {
    color: #4caf50;
  }

  @media (max-width: 768px) {
    font-size: 20px;
    img {
      height: 60px;
      width: 60px;
    }
  }
`;

const Header: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.isAuthenticated);
  const isAdmin = useSelector((state: RootState) => state.auth.isAdmin);

  const items = useSelector((state: RootState) => state.cart.items);

  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);
  const closeDropdown = () => setIsDropdownOpen(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <HeaderWrapper>
      <Logo>
        <StyledLink to="/">
          <ImageLogo>
            <img
              src="https://www.onlinelogomaker.com/blog/wp-content/uploads/2017/06/shopping-online.jpg"
              alt="logo"
            />
          </ImageLogo>
          E-commerce
        </StyledLink>
      </Logo>
      <Nav>
        {user && (
          <>
            <StyledLink to="/products">Products</StyledLink>
            {isAdmin && <StyledLink to="/addProduct">Add Product</StyledLink>}
            <StyledLink to="/contact">Contact</StyledLink>
            <StyledLink to="/about">About</StyledLink>
            {isAdmin && (
              <StyledLink to="/adminLayout">Admin Dashboard</StyledLink>
            )}
            <form onSubmit={handleSearch}></form>
            <StyledLink to="/cart">
              <CartContainer>
                <CartIcon />
                {items.length > 0 ? (
                  <CartItems>
                    {items.reduce(
                      (total, item) => total + (item.quantity || 0),
                      0
                    )}
                  </CartItems>
                ) : (
                  <CartItems>0</CartItems>
                )}
              </CartContainer>
            </StyledLink>
            <DropdownContainerHover>
              <DropdownButton onClick={toggleDropdown}>
                My Account
              </DropdownButton>
              <DropdownMenu
                isOpen={isDropdownOpen}
                onMouseLeave={closeDropdown}
              >
                <DropdownItem to="/profile">My Profile</DropdownItem>
                <DropdownItem to="/wishList">Wishlist</DropdownItem>
                <DropdownItem to="/orderHistory">Order</DropdownItem>
                {isAdmin && (
                  <DropdownItem to="/adminHistory">History</DropdownItem>
                )}
              </DropdownMenu>
            </DropdownContainerHover>
          </>
        )}
        {!user && (
          <UserActions>
            <StyledLink to="/login">Login</StyledLink>
            <StyledLink to="/signup">SignUp</StyledLink>
          </UserActions>
        )}
      </Nav>
    </HeaderWrapper>
  );
};

export default Header;
