import {
  Body,
  Button,
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

interface WelcomeEmailProps {
  userName: string;
  loginUrl?: string;
}

const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

export const WelcomeEmail: React.FC<WelcomeEmailProps> = ({
  userName = 'User',
  loginUrl = `${baseUrl}/login`,
}: WelcomeEmailProps): React.ReactElement => {
  return (
    <Html>
      <Head />
      <Preview>Welcome to Noted - Your Account is Ready!</Preview>
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
          <Heading style={heading}>Welcome to Noted, {userName}!</Heading>
          <Text style={text}>
            Thank you for creating an account with Noted. Your account has been successfully created and you're ready to get started.
          </Text>
          <Text style={text}>
            Noted is your secure platform for managing notes and staying organized. We're excited to have you on board!
          </Text>
          <Section style={buttonContainer}>
            <Button style={button} href={loginUrl}>
              Get Started
            </Button>
          </Section>
          <Hr style={hr} />
          <Section style={footer}>
            <Text style={footerText}>
              If you have any questions or need help, feel free to reach out to our support team.
            </Text>
            <Text style={footerText}>
              <Link href="/" style={footerLink}>
                Terms & Conditions
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default WelcomeEmail;

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
  marginBottom: '15px',
};

const text = {
  color: '#555559',
  fontSize: '16px',
  lineHeight: '26px',
  marginBottom: '15px',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '30px 0',
};

const button = {
  backgroundColor: '#4a7eb6',
  borderRadius: '3px',
  color: '#ffffff',
  fontSize: '16px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 20px',
};

const footer = {
  textAlign: 'center' as const,
  padding: '20px',
};

const footerText = {
  fontSize: '14px',
  color: '#555559',
  marginBottom: '10px',
};

const footerLink = {
  color: '#4a7eb6',
  textDecoration: 'none',
};

