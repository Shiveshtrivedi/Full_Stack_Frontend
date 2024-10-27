import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { IoLogoFacebook } from 'react-icons/io5';
import { FcGoogle } from 'react-icons/fc';
import { FaLinkedin } from 'react-icons/fa';

const FooterWrapper = styled.footer`
  padding: 16px 32px;
  background-color: #333333;
  color: #ffffff;
  text-align: center;
`;

const FooterLinks = styled.div`
  margin-bottom: 16px;
`;

const StyledLink = styled(Link)`
  color: #ffffff;
  margin-right: 16px;
  text-decoration: none;

  &:last-child {
    margin-right: 0;
  }

  &:hover {
    text-decoration: underline;
  }
`;

const SocialMedia = styled.div`
  margin-bottom: 16px;
`;

const SocialIcon = styled.a`
  color: #ffffff;
  margin: 0 10px;
  font-size: 24px;
  transition: color 0.3s ease;

  &:hover {
    color: #00aced;
  }

  &:first-child {
    margin-left: 0;
  }

  &:last-child {
    margin-right: 0;
  }
`;

const ContactInfo = styled.div`
  font-size: 14px;
`;

const Footer: React.FC = () => {
  return (
    <FooterWrapper>
      <FooterLinks>
        <StyledLink to="/terms">Terms of Service</StyledLink>
        <StyledLink to="/privacy">Privacy Policy</StyledLink>
        <StyledLink to="/help">Help</StyledLink>
      </FooterLinks>
      <SocialMedia>
        <SocialIcon
          href="https://www.facebook.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <IoLogoFacebook />
        </SocialIcon>
        <SocialIcon
          href="https://www.google.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FcGoogle />
        </SocialIcon>
        <SocialIcon
          href="https://www.linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaLinkedin />
        </SocialIcon>
      </SocialMedia>
      <ContactInfo>
        Contact us at: shivesh.trivedi@intimetec.com | 123-456-7890
      </ContactInfo>
    </FooterWrapper>
  );
};

export default Footer;
