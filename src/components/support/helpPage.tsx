import React from 'react';
import styled from 'styled-components';

const HelpContainer = styled.div`
  padding: 20px;
  background-color: #f4f4f4;
  border-radius: 8px;
  box-shadow: 0 4px 8px #00000050;
  max-width: 800px;
  margin: 0 auto;
`;

const Heading = styled.h1`
  font-size: 28px;
  margin-bottom: 20px;
`;

const Section = styled.section`
  margin-bottom: 20px;
`;

const SectionHeading = styled.h2`
  font-size: 22px;
  margin-bottom: 10px;
`;

const Paragraph = styled.p`
  line-height: 1.6;
  margin-bottom: 15px;
`;

const List = styled.ul`
  margin: 10px 0;
  padding-left: 20px;
`;

const ListItem = styled.li`
  margin-bottom: 10px;
`;

const Help: React.FC = () => {
  return (
    <HelpContainer>
      <Heading>Help & Support</Heading>

      <Section>
        <SectionHeading>Frequently Asked Questions (FAQs)</SectionHeading>
        <Paragraph>
          Here are some of the most commonly asked questions about our service:
        </Paragraph>
        <List>
          <ListItem>
            <strong>How do I create an account?</strong>
            <p>
              To create an account, click on the Sign Up button at the top right
              corner of the page and follow the instructions.
            </p>
          </ListItem>
          <ListItem>
            <strong>How do I reset my password?</strong>
            <p>
              If you have forgotten your password, click on Forgot Password on
              the login page and follow the instructions to reset it.
            </p>
          </ListItem>
          <ListItem>
            <strong>How can I update my profile information?</strong>
            <p>
              Log in to your account, go to your profile settings, and update
              your information as needed.
            </p>
          </ListItem>
        </List>
      </Section>

      <Section>
        <SectionHeading>Troubleshooting Tips</SectionHeading>
        <Paragraph>
          If you are experiencing issues, try the following steps:
        </Paragraph>
        <List>
          <ListItem>
            <strong>Clear your browser cache and cookies.</strong>
            <p>
              This can resolve many issues related to outdated or corrupted
              data.
            </p>
          </ListItem>
          <ListItem>
            <strong>Ensure your browser is up to date.</strong>
            <p>Using an outdated browser can cause compatibility issues.</p>
          </ListItem>
          <ListItem>
            <strong>Check your internet connection.</strong>
            <p>
              Make sure you have a stable internet connection to access our
              services.
            </p>
          </ListItem>
        </List>
      </Section>

      <Section>
        <SectionHeading>Contact Us</SectionHeading>
        <Paragraph>
          If you need further assistance, please contact us:
          <br />
          Email:shiveshtrivedi@intimetec.com
          <br />
          Phone: 123-456-7890
          <br />
          Address: Kanakpura sirsi road Jaipur Rajasthan
        </Paragraph>
      </Section>
    </HelpContainer>
  );
};

export default Help;
