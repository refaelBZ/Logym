const nodemailer = require('nodemailer');

// Configure nodemailer transporter from ENV
function buildTransporter() {
  const {
    EMAIL_SERVICE,
    EMAIL_HOST,
    EMAIL_PORT,
    EMAIL_SECURE,
    EMAIL_USER,
    EMAIL_PASS
  } = process.env;

  const enableDebug = process.env.EMAIL_DEBUG === 'true';

  if (EMAIL_SERVICE) {
    return nodemailer.createTransport({
      service: EMAIL_SERVICE,
      auth: { user: EMAIL_USER, pass: EMAIL_PASS },
      logger: enableDebug,
      debug: enableDebug
    });
  }

  return nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT ? Number(EMAIL_PORT) : 587,
    secure: EMAIL_SECURE ? EMAIL_SECURE === 'true' : false,
    auth: { user: EMAIL_USER, pass: EMAIL_PASS },
    logger: enableDebug,
    debug: enableDebug
  });
}

const transporter = buildTransporter();

function logTransportConfigSummary() {
  const {
    EMAIL_SERVICE,
    EMAIL_HOST,
    EMAIL_PORT,
    EMAIL_SECURE,
    EMAIL_USER
  } = process.env;
  if (EMAIL_SERVICE) {
    console.log(`Email: using service=${EMAIL_SERVICE}, user=${EMAIL_USER}`);
  } else {
    console.log(`Email: using host=${EMAIL_HOST}, port=${EMAIL_PORT || 587}, secure=${EMAIL_SECURE || false}, user=${EMAIL_USER}`);
  }
}

async function verifyTransporter() {
  try {
    console.log('Email: verifying SMTP transporter...');
    logTransportConfigSummary();
    await transporter.verify();
    console.log('Email: transporter verified');
  } catch (err) {
    console.error(`Email: transporter verification failed: ${err && err.message ? err.message : err}`);
  }
}

function buildWelcomeEmail(username, appName) {
  const appUrl = 'https://app.logym.fit';
  const subject = process.env.WELCOME_SUBJECT || `Welcome to ${appName}! Start seeing results.`;

  const text = [
    `Hi ${username},`,
    '',
    `Welcome to ${appName}. Start seeing results.`,
    '',
    `Open the app: ${appUrl}`,
    '',
    `Cheers,`,
    `The ${appName} Team`
  ].join('\n');

  const html = `
  <!doctype html>
  <html lang="en">
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>${subject}</title>
    </head>
    <body style="margin:0;padding:0;background-color:#1A1A1A;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#1A1A1A;">
        <tr>
          <td align="center" style="padding:24px;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:640px;background-color:#242424;border:1px solid #424242;border-radius:15px;overflow:hidden;">
              <tr>
                <td style="padding:28px 28px 12px 28px;font-family:Roboto, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;color:#ffffff;text-align:center;">
                  <div style="font-size:26px;font-weight:800;line-height:1.2;">Welcome to ${appName}</div>
                </td>
              </tr>
              <tr>
                <td style="padding:4px 28px 0 28px;font-family:Roboto, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;color:#98989c;text-align:center;">
                  <div style="font-size:16px;line-height:1.6;">Hi ${username}, thanks for signing up. <span style="color:#eaff00;font-weight:800;">Start seeing results.</span></div>
                </td>
              </tr>
              <tr>
                <td align="center" style="padding:24px 28px 8px 28px;">
                  <a href="${appUrl}" target="_blank" style="display:inline-block;background-color:#eaff00;color:#000000;text-decoration:none;padding:14px 28px;border-radius:15px;font-size:16px;font-weight:500;font-family:Roboto, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;">Open ${appName}</a>
                </td>
              </tr>
              <tr>
                <td style="padding:12px 28px 28px 28px;font-family:Roboto, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;color:#98989c;text-align:center;">
                  <div style="font-size:12px;line-height:1.6;">If the button doesn’t work, copy and paste this link into your browser:<br/><a href="${appUrl}" style="color:#eaff00;text-decoration:none;">${appUrl}</a></div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>`;

  return { subject, text, html };
}

async function sendWelcomeEmail(user) {
  const fromName = process.env.EMAIL_FROM_NAME || process.env.APP_NAME || 'Logym';
  const fromEmail = process.env.EMAIL_FROM || process.env.EMAIL_USER || 'noreply@example.com';
  const appName = process.env.APP_NAME || 'Logym';

  const { subject, text, html } = buildWelcomeEmail(user.username, appName);

  const mailOptions = {
    from: `${fromName} <${fromEmail}>`,
    to: user.email,
    subject,
    text,
    html
  };

  console.log(`Email: sending welcome email to ${user.email}`);
  const info = await transporter.sendMail(mailOptions);
  console.log(`Email: sent messageId=${info && info.messageId ? info.messageId : 'unknown'}`);
  if (info) {
    console.log(`Email: accepted=${JSON.stringify(info.accepted || [])}, rejected=${JSON.stringify(info.rejected || [])}`);
    if (info.response) {
      console.log(`Email: response=${info.response}`);
    }
  }
}

function buildResetEmail(username, appName, resetLink) {
  const subject = `Reset your ${appName} password`;
  const text = [
    `Hi ${username},`,
    '',
    `We received a request to reset your ${appName} password.`,
    `If you didn't request this, you can safely ignore this email.`,
    '',
    `Reset your password: ${resetLink}`,
    '',
    `Cheers,`,
    `The ${appName} Team`
  ].join('\n');

  const html = `
  <!doctype html>
  <html lang="en">
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>${subject}</title>
    </head>
    <body style="margin:0;padding:0;background-color:#1A1A1A;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#1A1A1A;">
        <tr>
          <td align="center" style="padding:24px;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:640px;background-color:#242424;border:1px solid #424242;border-radius:15px;overflow:hidden;">
              <tr>
                <td style="padding:28px 28px 12px 28px;font-family:Roboto, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;color:#ffffff;text-align:center;">
                  <div style="font-size:26px;font-weight:800;line-height:1.2;">Reset your password</div>
                </td>
              </tr>
              <tr>
                <td style="padding:4px 28px 0 28px;font-family:Roboto, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;color:#98989c;text-align:center;">
                  <div style="font-size:16px;line-height:1.6;">Click the button below to set a new password for your <span style="color:#eaff00;font-weight:800;">${appName}</span> account.</div>
                </td>
              </tr>
              <tr>
                <td align="center" style="padding:24px 28px 8px 28px;">
                  <a href="${resetLink}" target="_blank" style="display:inline-block;background-color:#eaff00;color:#000000;text-decoration:none;padding:14px 28px;border-radius:15px;font-size:16px;font-weight:500;font-family:Roboto, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;">Reset Password</a>
                </td>
              </tr>
              <tr>
                <td style="padding:12px 28px 28px 28px;font-family:Roboto, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;color:#98989c;text-align:center;">
                  <div style="font-size:12px;line-height:1.6;">If the button doesn’t work, copy and paste this link into your browser:<br/><a href="${resetLink}" style="color:#eaff00;text-decoration:none;">${resetLink}</a></div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>`;

  return { subject, text, html };
}

async function sendPasswordResetEmail(user, resetLink) {
  const fromName = process.env.EMAIL_FROM_NAME || process.env.APP_NAME || 'Logym';
  const fromEmail = process.env.EMAIL_FROM || process.env.EMAIL_USER || 'noreply@example.com';
  const appName = process.env.APP_NAME || 'Logym';
  const { subject, text, html } = buildResetEmail(user.username || 'there', appName, resetLink);

  const mailOptions = {
    from: `${fromName} <${fromEmail}>`,
    to: user.email,
    subject,
    text,
    html
  };

  console.log(`Email: sending password reset to ${user.email}`);
  const info = await transporter.sendMail(mailOptions);
  console.log(`Email: reset sent messageId=${info && info.messageId ? info.messageId : 'unknown'}`);
  if (info) {
    console.log(`Email: accepted=${JSON.stringify(info.accepted || [])}, rejected=${JSON.stringify(info.rejected || [])}`);
    if (info.response) {
      console.log(`Email: response=${info.response}`);
    }
  }
}

module.exports = { sendWelcomeEmail, verifyTransporter, sendPasswordResetEmail };