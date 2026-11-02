import nodemailer from 'nodemailer';

/**
 * Configuration du transporteur d'email
 */
const transporter = nodemailer.createTransport({
  service: 'gmail',
  tls: { rejectUnauthorized: true },
  auth: {
    user: process.env.EMAIL_USER?.trim(),
    pass: process.env.EMAIL_PASSWORD?.replace(/\s/g, '')
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
    if (!process.env.EMAIL_USER?.trim() || !process.env.EMAIL_PASSWORD?.trim()) {
      throw new Error('EMAIL_USER et EMAIL_PASSWORD doivent être configurés sur le serveur.');
    }
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
    console.error('❌ Email non envoyé:', error.code === 'EAUTH'
      ? 'Gmail refuse les identifiants SMTP. Configurez EMAIL_USER avec le compte expéditeur et EMAIL_PASSWORD avec un nouveau mot de passe d’application Google de ce même compte, puis redémarrez le serveur.'
      : { code: error.code, message: error.message });
    throw new Error(`Erreur d'envoi d'email: ${error.message}`);
  }
};

/**
 * Configuration email par défaut
 */
export const emailConfig = {
  from: process.env.EMAIL_USER,
  contactEmail: process.env.CONTACT_EMAIL || process.env.EMAIL_USER,
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3011'
};

export default transporter;