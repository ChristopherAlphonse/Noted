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
exports.ContactFormEmail = void 0;
const components_1 = require("@react-email/components");
const React = __importStar(require("react"));
const ContactFormEmail = ({ userName = 'Anonymous User', userEmail = 'noreply@example.com', subject = 'No Subject', message = 'No message provided', }) => {
    return (React.createElement(components_1.Html, null,
        React.createElement(components_1.Head, null),
        React.createElement(components_1.Preview, null,
            "Contact Form Submission: ",
            subject),
        React.createElement(components_1.Body, { style: main },
            React.createElement(components_1.Container, { style: container },
                React.createElement(components_1.Section, { style: logoContainer },
                    React.createElement(components_1.Img, { src: "https://res.cloudinary.com/img-api-pager-2/image/upload/v1667612088/Noted/logo_cqd6pf.png", width: "600", height: "300", alt: "Noted Logo", style: logo })),
                React.createElement(components_1.Hr, { style: hr }),
                React.createElement(components_1.Heading, { style: heading }, "New Contact Form Submission"),
                React.createElement(components_1.Section, { style: infoSection },
                    React.createElement(components_1.Text, { style: infoLabel },
                        React.createElement("strong", null, "From:")),
                    React.createElement(components_1.Text, { style: infoText },
                        userName,
                        " (",
                        userEmail,
                        ")"),
                    React.createElement(components_1.Text, { style: infoLabel },
                        React.createElement("strong", null, "Subject:")),
                    React.createElement(components_1.Text, { style: infoText }, subject),
                    React.createElement(components_1.Text, { style: infoLabel },
                        React.createElement("strong", null, "Message:")),
                    React.createElement(components_1.Text, { style: messageText }, message)),
                React.createElement(components_1.Hr, { style: hr }),
                React.createElement(components_1.Section, { style: footer },
                    React.createElement(components_1.Text, { style: footerText }, "This email was sent via the Noted contact form."),
                    React.createElement(components_1.Text, { style: footerText },
                        "Reply directly to this email to respond to ",
                        userName,
                        "."),
                    React.createElement(components_1.Text, { style: footerText },
                        React.createElement(components_1.Link, { href: "/", style: footerLink }, "Noted Application")))))));
};
exports.ContactFormEmail = ContactFormEmail;
exports.default = exports.ContactFormEmail;
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
    textAlign: 'center',
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
