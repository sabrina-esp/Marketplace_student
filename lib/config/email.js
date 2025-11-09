import nodemailer from 'nodemailer';

console.log('📧 Configuration du service email');
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? '***défini***' : 'undefined');

/**
 * Configuration du transporteur d'email
 */
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
});

/**
 * Vérifier la configuration email
 */
export const verifyEmailConfig = async () => {
  try {
    await transporter.verify();
    console.log('✅ Configuration email validée');
    return { success: true };
  } catch (error) {
    console.error('❌ Erreur de configuration email:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Envoyer un email
 */
export const sendEmail = async ({ to, subject, html, text, replyTo }) => {
  try {
    const mailOptions = {
      from: `"Marketplace" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      text,
      replyTo
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Email envoyé:', {
      messageId: info.messageId,
      to: typeof to === 'string' ? to : to.join(', '),
      subject
    });

    return { 
      success: true, 
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected
    };
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de l\'email:', error);
    throw new Error(`Erreur d'envoi d'email: ${error.message}`);
  }
};

/**
 * Configuration email par défaut
 */
export const emailConfig = {
  from: process.env.EMAIL_USER,
  contactEmail: process.env.CONTACT_EMAIL || process.env.EMAIL_USER,
  appUrl: process.env.NEXT_PUBLIC_APP_URL
};

export default transporter;