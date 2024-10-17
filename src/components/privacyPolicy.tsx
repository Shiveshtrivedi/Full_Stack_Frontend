import React from 'react';
import styled from 'styled-components';

const PrivacyPolicyContainer = styled.div`
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

const PrivacyPolicy: React.FC = () => {
  return (
    <PrivacyPolicyContainer>
      <Heading>Privacy Policy</Heading>

      <Section>
        <SectionHeading>Introduction</SectionHeading>
        <Paragraph>
          Welcome to ITTs Privacy Policy. This policy explains how we collect,
          use, and protect your personal information when you use our services.
          We are committed to ensuring the privacy and protection of your data.
        </Paragraph>
      </Section>

      <Section>
        <SectionHeading>Information We Collect</SectionHeading>
        <Paragraph>
          We may collect and process the following types of information:
          <ul>
            <li>
              Personal identification information name - shivesh trivedi ,phone
              - 7800525592.
            </li>
            <li>Usage data ( 172.16.1.211, v8 engine).</li>
            <li>Payment information credit card details, billing address.</li>
          </ul>
        </Paragraph>
      </Section>

      <Section>
        <SectionHeading>How We Use Your Information</SectionHeading>
        <Paragraph>
          We use your information to:
          <ul>
            <li>Provide and improve our services.</li>
            <li>Process transactions and manage your account.</li>
            <li>
              Send you promotional and marketing communications, if you have
              opted in.
            </li>
            <li>Respond to your inquiries and support needs.</li>
          </ul>
        </Paragraph>
      </Section>

      <Section>
        <SectionHeading>How We Protect Your Information</SectionHeading>
        <Paragraph>
          We implement appropriate technical and organizational measures to
          ensure the security of your personal information. This includes
          encryption, access controls, and regular security assessments.
        </Paragraph>
      </Section>

      <Section>
        <SectionHeading>Sharing Your Information</SectionHeading>
        <Paragraph>
          We do not sell or rent your personal information to third parties. We
          may share your information with:
          <ul>
            <li>Service providers who assist us in operating our business.</li>
            <li>
              Law enforcement or regulatory authorities, if required by law.
            </li>
            <li>
              Other third parties with your consent or as part of a business
              transfer.
            </li>
          </ul>
        </Paragraph>
      </Section>

      <Section>
        <SectionHeading>Your Rights</SectionHeading>
        <Paragraph>
          You have the right to:
          <ul>
            <li>Access, correct, or delete your personal information.</li>
            <li>Object to or restrict the processing of your data.</li>
            <li>Withdraw consent at any time, where applicable.</li>
          </ul>
          To exercise these rights, please contact us at [Your Contact
          Information].
        </Paragraph>
      </Section>

      <Section>
        <SectionHeading>Changes to This Policy</SectionHeading>
        <Paragraph>
          We may update this Privacy Policy from time to time. We will notify
          you of any significant changes by posting the new policy on our
          website. Please review this policy periodically to stay informed about
          how we are protecting your data.
        </Paragraph>
      </Section>

      <Section>
        <SectionHeading>Contact Us</SectionHeading>
        <Paragraph>
          If you have any questions or concerns about this Privacy Policy,
          please contact us at:
          <br />
          Email: shiveshtrivedi@intimetec.com
          <br />
          Address: Kanakpura sirsi road Jaipur Rajasthan
        </Paragraph>
      </Section>
    </PrivacyPolicyContainer>
  );
};

export default PrivacyPolicy;
