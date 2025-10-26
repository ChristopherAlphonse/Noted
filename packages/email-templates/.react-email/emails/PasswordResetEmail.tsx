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

interface PasswordResetEmailProps {
  userName: string;
  resetUrl: string;
}

const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

export const PasswordResetEmail: React.FC<PasswordResetEmailProps> = ({
  userName = 'User',
  resetUrl = `${baseUrl}/resetpassword/token123`,
}: PasswordResetEmailProps): React.ReactElement => {
  return (
    <Html>
      <Head />
      <Preview>Password Reset Request - Noted</Preview>
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
          <Heading style={heading}>Hello {userName},</Heading>
          <Text style={text}>
            We have received a password reset request from your account. If this is an error, please ignore this email.
          </Text>
          <Section style={buttonContainer}>
            <Button style={button} href={resetUrl}>
              Reset Password
            </Button>
          </Section>
          <Text style={notice}>
            <strong>Notice:</strong> This link expires in 30 minutes
          </Text>
          <Hr style={hr} />
          <Section style={footer}>
            <Text style={footerText}>
              <Link href="/" style={footerLink}>
                Terms & Conditions
              </Link>
            </Text>
            <Text style={footerDisclaimer}>
              Please only forward this email to those who it may concern; do not share your password with anyone who may use it for malicious purposes.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default PasswordResetEmail;

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

const notice = {
  fontSize: '14px',
  color: '#666',
  textAlign: 'center' as const,
};

const footer = {
  textAlign: 'center' as const,
  padding: '20px',
};

const footerText = {
  fontSize: '16px',
  color: '#555559',
  marginBottom: '10px',
};

const footerLink = {
  color: '#4a7eb6',
  textDecoration: 'none',
};

const footerDisclaimer = {
  fontSize: '10px',
  color: '#8c8f91',
  marginTop: '10px',
};

