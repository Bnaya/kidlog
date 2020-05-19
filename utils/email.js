const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  //create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  //define the email options
  const mailOptions = {
    from: 'Maya Liberman <hello@kidlog.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    //html
  };
  await transporter.sendMail(mailOptions);
  //actually send the email
};

module.exports = sendEmail;
