const nodemailer = require('nodemailer');

// Configure nodemailer with your email service details
const transporter = nodemailer.createTransport({
  service: 'gmail',  // או כל שירות אימייל אחר
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function sendWelcomeEmail(user) {
  const mailOptions = {
    from: '"Your App Name" <noreply@yourapp.com>',
    to: user.email,
    subject: 'ברוך הבא לאפליקציה שלנו!',
    text: `שלום ${user.username},\n\nברוך הבא לאפליקציה שלנו! אנחנו שמחים שהצטרפת אלינו.\n\nבברכה,\nצוות האפליקציה`,
    html: `<h1>שלום ${user.username},</h1><p>ברוך הבא לאפליקציה שלנו! אנחנו שמחים שהצטרפת אלינו.</p><p>בברכה,<br>צוות האפליקציה</p>`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Welcome email sent successfully');
  } catch (error) {
    console.error('Error sending welcome email:', error);
  }
}

module.exports = { sendWelcomeEmail };