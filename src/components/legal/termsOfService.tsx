import React from 'react';
import styled from 'styled-components';

const TermsOfServiceContainer = styled.div`
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

const TermsOfService: React.FC = () => {
  return (
    <TermsOfServiceContainer>
      <Heading>Terms of Service</Heading>

      <Section>
        <SectionHeading>1. Introduction</SectionHeading>
        <Paragraph>
          Welcome to ITT. By accessing or using our website and services, you
          agree to comply with and be bound by these Terms of Service. If you do
          not agree with these terms, please do not use our services.
        </Paragraph>
      </Section>

      <Section>
        <SectionHeading>2. Use of Our Services</SectionHeading>
        <Paragraph>
          You agree to use our services only for lawful purposes and in
          accordance with our Acceptable Use Policy. You must not:
        </Paragraph>
        <List>
          <ListItem>
            Use our services in any way that violates applicable laws or
            regulations.
          </ListItem>
          <ListItem>
            Engage in any unauthorized or illegal activity, including hacking or
            distributing malware.
          </ListItem>
          <ListItem>
            Interfere with or disrupt the integrity or performance of our
            services.
          </ListItem>
        </List>
      </Section>

      <Section>
        <SectionHeading>3. Account Responsibilities</SectionHeading>
        <Paragraph>
          If you create an account, you are responsible for maintaining the
          confidentiality of your account information and for all activities
          that occur under your account. You agree to notify us immediately of
          any unauthorized use of your account.
        </Paragraph>
      </Section>

      <Section>
        <SectionHeading>4. Intellectual Property</SectionHeading>
        <Paragraph>
          All content and materials provided through our services, including
          text, graphics, logos, and software, are the property of ITT or its
          licensors and are protected by intellectual property laws. You may not
          use or reproduce any content without our prior written permission.
        </Paragraph>
      </Section>

      <Section>
        <SectionHeading>5. Limitation of Liability</SectionHeading>
        <Paragraph>
          To the fullest extent permitted by law, ITT shall not be liable for
          any indirect, incidental, special, consequential, or punitive damages
          arising out of or related to your use of our services. Our total
          liability for any claims arising out of these Terms of Service shall
          be limited to the amount paid by you for the use of our services.
        </Paragraph>
      </Section>

      <Section>
        <SectionHeading>6. Changes to These Terms</SectionHeading>
        <Paragraph>
          We reserve the right to modify these Terms of Service at any time. We
          will notify you of any significant changes by posting the new terms on
          our website. Your continued use of our services after any changes
          constitutes your acceptance of the updated terms.
        </Paragraph>
      </Section>

      <Section>
        <SectionHeading>7. Termination</SectionHeading>
        <Paragraph>
          We may terminate or suspend your access to our services if you violate
          these Terms of Service or if we believe that such action is necessary
          to protect our services, users, or legal obligations.
        </Paragraph>
      </Section>

      <Section>
        <SectionHeading>8. Contact Us</SectionHeading>
        <Paragraph>
          If you have any questions about these Terms of Service, please contact
          us at:
          <br />
          Email:shiveshtrivedi@intimetec.com
          <br />
          Address:Kanakpur sirsi road Jaipur Rajasthan
        </Paragraph>
      </Section>
    </TermsOfServiceContainer>
  );
};

export default TermsOfService;
