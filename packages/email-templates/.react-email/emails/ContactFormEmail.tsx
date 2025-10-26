import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface ContactFormEmailProps {
  userName: string;
  userEmail: string;
  subject: string;
  message: string;
}

export const ContactFormEmail: React.FC<ContactFormEmailProps> = ({
  userName = 'Anonymous User',
  userEmail = 'noreply@example.com',
  subject = 'No Subject',
  message = 'No message provided',
}: ContactFormEmailProps): React.ReactElement => {
  return (
    <Html>
      <Head />
      <Preview>Contact Form Submission: {subject}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logoContainer}>
            <Img
              src="https://res.cloudinary.com/img-api-pager-2/image/upload/v1667612088/Noted/logo_cqd6pf.png"
              width="600"
              height="300"
              alt="Noted Logo"
              style={logo}
            />
          </Section>
          <Hr style={hr} />
          <Heading style={heading}>New Contact Form Submission</Heading>

          <Section style={infoSection}>
            <Text style={infoLabel}><strong>From:</strong></Text>
            <Text style={infoText}>{userName} ({userEmail})</Text>

            <Text style={infoLabel}><strong>Subject:</strong></Text>
            <Text style={infoText}>{subject}</Text>

            <Text style={infoLabel}><strong>Message:</strong></Text>
            <Text style={messageText}>{message}</Text>
          </Section>

          <Hr style={hr} />
          <Section style={footer}>
            <Text style={footerText}>
              This email was sent via the Noted contact form.
            </Text>
            <Text style={footerText}>
              Reply directly to this email to respond to {userName}.
            </Text>
            <Text style={footerText}>
              <Link href="/" style={footerLink}>
                Noted Application
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default ContactFormEmail;

const main = {
  backgroundColor: '#f6f6f6',
  fontFamily: 'Arial, sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px',
  backgroundColor: '#ffffff',
  border: '1px solid #eeeff0',
  borderRadius: '5px',
  maxWidth: '600px',
};

const logoContainer = {
  textAlign: 'center' as const,
  backgroundColor: '#fff',
  padding: '20px',
};

const logo = {
  margin: '0 auto',
  width: '100%',
  maxWidth: '600px',
  height: 'auto',
};

const hr = {
  borderColor: '#eeeff0',
  margin: '15px 0',
};

const heading = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#555559',
  marginBottom: '20px',
};

const infoSection = {
  marginBottom: '20px',
};

const infoLabel = {
  color: '#333',
  fontSize: '14px',
  fontWeight: 'bold',
  marginBottom: '5px',
  marginTop: '15px',
};

const infoText = {
  color: '#555559',
  fontSize: '16px',
  lineHeight: '24px',
  marginTop: '0',
  marginBottom: '10px',
};

const messageText = {
  color: '#555559',
  fontSize: '16px',
  lineHeight: '24px',
  padding: '15px',
  backgroundColor: '#f9f9f9',
  borderLeft: '4px solid #4a7eb6',
  marginTop: '5px',
};

const footer = {
  textAlign: 'center' as const,
  padding: '20px',
};

const footerText = {
  fontSize: '14px',
  color: '#8c8f91',
  marginBottom: '10px',
};

const footerLink = {
  color: '#4a7eb6',
  textDecoration: 'none',
};

