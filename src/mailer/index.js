const fs = require('fs');
const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');

const options = {
  auth: {
    api_key: process.env.SENDGRID_APIKEY,
  },
};

const client = nodemailer.createTransport(sgTransport(options));

const emailTemplate = fs.readFileSync('src/views/mail-templates/email.html', {
  encoding: 'utf-8',
});

const registerLink = (user) => {
  const url = `${process.env.API_URL}/verify_email`;
  return `${url}/${user.registrationToken}`;
};

const resetPasswordLink = (user) => {
  const url = `${process.env.API_URL}/reset_password`;
  return `${url}/${user.resetPasswordToken}`;
};

function getHtml(templateName, user) {
  switch (templateName) {
    case 'register':
      return emailTemplate
        .replace('$name', user.name)
        .replace(
          '$content',
          `By clicking on the following link, you are confirming your email address. <br /> <a href="${registerLink(
            user,
          )}">Confirm Email Address</a>`,
        );
    case 'forgotPassword':
      return emailTemplate
        .replace('$name', user.name)
        .replace(
          '$content',
          `By clicking on the following link, you can reset password address. <br /> <a href="${resetPasswordLink(
            user,
          )}">Reset Password</a>`,
        );
    default:
      return emailTemplate;
  }
}

function sendMail(user, templateName, subject, callback) {
  if (process.env.NODE_ENV === 'test') return callback('success', false);

  const html = getHtml(templateName, user);
  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to: user.email,
    subject,
    preheader: 'Boilerplate',
    html,
  };
  client.sendMail(mailOptions, (error, info) => {
    callback(info, error);
  });
}

module.exports = {
  sendMail,
};
