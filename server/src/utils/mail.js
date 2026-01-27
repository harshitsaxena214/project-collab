import Mailgen from "mailgen";
import nodemailer from "nodemailer";

const sendMail = async (options) => {
  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Board Flow",
      link: "https://mailgen.js/",
    },
  });

  var emailBody = mailGenerator.generate(options.mailGenContent);
  var emailText = mailGenerator.generatePlaintext(options.mailGenContent);

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mail = {
    from: process.env.SENDER_MAIL,
    to: options.email,
    subject: options.subject,
    text: emailText, // Plain-text version of the message
    html: emailBody, // HTML version of the message
  };

  try {
    await transporter.sendMail(mail);
  } catch (error) {
    console.error("Email failed", error);
  }
};

const emailVerificationMailGenContent = (username, verificationUrl) => {
  return {
    body: {
      name: username,
      intro: "Welcome to BoardFlow! We're very excited to have you on board",
      action: {
        instructions: "To get started with our App, please click here:",
        button: {
          color: "#6366F1",
          text: "Verify your email",
          link: verificationUrl,
        },
      },
      outro: [
        "Verify your email to start planning, tracking, and shipping projects faster.",
      ],
    },
  };
};

const forgotPasswordMailGenContent = (username, passwordResetUrl) => {
  return {
    body: {
      name: username,
      intro: "We got a request to reset your Password",
      action: {
        instructions: "To change your password, please click here:",
        button: {
          color: "#2563EB",
          text: "Reset Password",
          link: passwordResetUrl,
        },
      },
      outro: [
        "If you didn’t request a password reset, you can safely ignore this email. Your account will remain secure.",
      ],
    },
  };
};

// sendMail({
//     email: user.email,
//     subject:"aaa",
//     mailGenContent: emailVerificationMailGenContent(
//         username,``
//     )
// })
export { sendMail }