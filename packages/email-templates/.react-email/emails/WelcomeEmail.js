"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.WelcomeEmail = void 0;
const components_1 = require("@react-email/components");
const React = __importStar(require("react"));
const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
const WelcomeEmail = ({ userName = 'User', loginUrl = `${baseUrl}/login`, }) => {
    return (React.createElement(components_1.Html, null,
        React.createElement(components_1.Head, null),
        React.createElement(components_1.Preview, null, "Welcome to Noted - Your Account is Ready!"),
        React.createElement(components_1.Body, { style: main },
            React.createElement(components_1.Container, { style: container },
                React.createElement(components_1.Section, { style: logoContainer },
                    React.createElement(components_1.Img, { src: "https://res.cloudinary.com/img-api-pager-2/image/upload/v1667612088/Noted/logo_cqd6pf.png", width: "600", height: "300", alt: "Noted Logo", style: logo })),
                React.createElement(components_1.Hr, { style: hr }),
                React.createElement(components_1.Heading, { style: heading },
                    "Welcome to Noted, ",
                    userName,
                    "!"),
                React.createElement(components_1.Text, { style: text }, "Thank you for creating an account with Noted. Your account has been successfully created and you're ready to get started."),
                React.createElement(components_1.Text, { style: text }, "Noted is your secure platform for managing notes and staying organized. We're excited to have you on board!"),
                React.createElement(components_1.Section, { style: buttonContainer },
                    React.createElement(components_1.Button, { style: button, href: loginUrl }, "Get Started")),
                React.createElement(components_1.Hr, { style: hr }),
                React.createElement(components_1.Section, { style: footer },
                    React.createElement(components_1.Text, { style: footerText }, "If you have any questions or need help, feel free to reach out to our support team."),
                    React.createElement(components_1.Text, { style: footerText },
                        React.createElement(components_1.Link, { href: "/", style: footerLink }, "Terms & Conditions")))))));
};
exports.WelcomeEmail = WelcomeEmail;
exports.default = exports.WelcomeEmail;
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
    textAlign: 'center',
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
    textAlign: 'center',
    margin: '30px 0',
};
const button = {
    backgroundColor: '#4a7eb6',
    borderRadius: '3px',
    color: '#ffffff',
    fontSize: '16px',
    textDecoration: 'none',
    textAlign: 'center',
    display: 'inline-block',
    padding: '12px 20px',
};
const footer = {
    textAlign: 'center',
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
