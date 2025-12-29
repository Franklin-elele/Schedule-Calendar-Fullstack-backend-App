import { setApiKey, send } from "@sendgrid/mail";

setApiKey(process.env.SENDGRID_API_KEY);


// ---------- Send Email Function ----------


const sendEmail = async ({ to, subject, text }) => {
  try {
    const msg = {
      to,
      from: process.env.EMAIL_USER, // must match your verified sender
      subject,
      text,
    };
    await send(msg);
    console.log(process.env.SENDGRID_API_KEY)
    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export default sendEmail;
