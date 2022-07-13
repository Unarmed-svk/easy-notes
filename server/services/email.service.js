const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");
require("dotenv").config();

let transporter = nodemailer.createTransport({
  service: "Gmail",
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

let mailGen = new Mailgen({
  theme: "default",
  product: {
    name: "Easy Notes",
    link: `${process.env.EMAIL_MAIN_URL}`,
  },
});

const sendEmail = async (userEmail, emailContent, emailSubject) => {
  let emailBody = mailGen.generate(emailContent);
  let message = {
    from: process.env.EMAIL,
    to: userEmail,
    subject: emailSubject,
    html: emailBody,
  };
  await transporter.sendMail(message);
  return true;
};

const registerEmail = async (userEmail, user) => {
  try {
    const emailToken = user.generateRegisterToken();
    const emailContent = {
      body: {
        name: userEmail,
        intro: "Welcome to Easy Notes! We are very excited to have you on board.",
        action: {
          instructions: "To validate your account, please click here:",
          button: {
            color: "#1a73e8",
            text: "Validate",
            link: `${process.env.EMAIL_MAIN_URL}verify?validation=${emailToken}`,
          },
        },
        outro: "If you have any questions, please respond to this email. We will gladly help you.",
      },
    };

    return await sendEmail(userEmail, emailContent, "Welcome to Easy Notes");
  } catch (err) {
    throw err;
  }
};

const updatedEmail = async (userEmail, user) => {
  try {
    const emailToken = user.generateRegisterToken();
    const emailContent = {
      body: {
        name: userEmail,
        intro: "We have recieved your request to change the email address.",
        action: {
          instructions: "Please click this link to validate your new email address:",
          button: {
            color: "#1a73e8",
            text: "Validate",
            link: `${process.env.EMAIL_MAIN_URL}api/user/verify?validation=${emailToken}`,
          },
        },
        outro:
          "If you believe you haven't made this request, please respond to this email. We will do what is in our capabilities to resolve this issue.",
      },
    };

    return await sendEmail(userEmail, emailContent, "Email verification, from Easy Notes");
  } catch (err) {
    throw err;
  }
};

module.exports = {
  registerEmail,
  updatedEmail,
};
