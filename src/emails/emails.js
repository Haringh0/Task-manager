const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const welcomeEmail = (email, name) => {
  const mailBody = {
    to: email,
    from: "nagpal3241@gmail.com",
    subject: "Welcome, to Task Manager App.",
    text: `Feeling wonderful, that you subscribed to our service. I look forward to our relationship ${name}.`,
  };

  sgMail.send(mailBody);
};

const cancelEmail = (email, name) => {
  const mailBody = {
    to: email,
    from: "nagpal3241@gmail.com",
    subject: "We are sad that you are leaving.",
    text: `We are Sorry ${name}, if we were unable to provide the services you required. But, you will always be a part of us. And, are always welcomed here anytime.`,
  };

  sgMail.send(mailBody);
};

module.exports = { welcomeEmail, cancelEmail };
