const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);


// ---------- Send Email Function ----------


const sendEmail = async ({ to, subject, text }) => {
  try {
    const msg = {
      to,
      from: process.env.EMAIL_USER, // must match your verified sender
      subject,
      text,
    };
    await sgMail.send(msg);
    console.log(process.env.SENDGRID_API_KEY)
    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = sendEmail;
