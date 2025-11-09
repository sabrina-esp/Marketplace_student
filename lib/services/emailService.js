import { sendEmail, emailConfig } from '@/lib/config/email';

/**
 * Envoyer un email de vérification
 */
export async function sendVerificationEmail(email, verificationToken, name = '') {
  console.log('📧 Préparation email de vérification pour:', email);
  
  const verificationUrl = `${emailConfig.appUrl}/verify?token=${verificationToken}`;
  
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <style>
        body { 
          font-family: Arial, sans-serif; 
          background-color: #f4f4f4; 
          margin: 0;
          padding: 0;
        }
        .container { 
          max-width: 600px; 
          margin: 40px auto; 
          background: white; 
          padding: 30px; 
          border-radius: 10px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .header { 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
          color: white; 
          padding: 30px; 
          text-align: center; 
          border-radius: 10px;
          margin-bottom: 30px;
        }
        .header h2 {
          margin: 0;
          font-size: 28px;
        }
        .content { 
          padding: 20px;
          color: #333;
          line-height: 1.6;
        }
        .button { 
          display: inline-block; 
          padding: 15px 40px; 
          background: #667eea; 
          color: white !important; 
          text-decoration: none; 
          border-radius: 5px; 
          margin: 20px 0;
          font-weight: bold;
        }
        .button-container {
          text-align: center;
          margin: 30px 0;
        }
        .link-text {
          word-break: break-all; 
          color: #667eea;
          font-size: 12px;
          background: #f8f9fa;
          padding: 10px;
          border-radius: 5px;
          margin: 15px 0;
        }
        .footer { 
          margin-top: 30px; 
          padding-top: 20px; 
          border-top: 1px solid #ddd; 
          font-size: 12px; 
          color: #999;
          text-align: center;
        }
        .warning {
          background: #fff3cd;
          border-left: 4px solid #ffc107;
          padding: 15px;
          margin: 20px 0;
          border-radius: 5px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>🔐 Vérification de votre compte</h2>
        </div>
        
        <div class="content">
          <p style="font-size: 16px;"><strong>Bonjour ${name || 'Utilisateur'},</strong></p>
          <p>Merci de vous être inscrit sur notre plateforme ! Pour activer votre compte, veuillez cliquer sur le bouton ci-dessous :</p>
          
          <div class="button-container">
            <a href="${verificationUrl}" class="button">✅ Vérifier mon email</a>
          </div>
          
          <p>Ou copiez ce lien dans votre navigateur :</p>
          <div class="link-text">${verificationUrl}</div>
          
          <div class="warning">
            <strong>⏰ Important :</strong> Ce lien expire dans 24 heures.
          </div>
        </div>

        <div class="footer">
          <p>Si vous n'avez pas créé de compte, ignorez cet email.</p>
          <p>© ${new Date().getFullYear()} Marketplace</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const textContent = `
    Bonjour ${name || 'Utilisateur'},
    
    Merci de vous être inscrit ! Pour vérifier votre email, cliquez sur ce lien :
    ${verificationUrl}
    
    Ce lien expire dans 24 heures.
    
    Si vous n'avez pas créé de compte, ignorez cet email.
  `;

  return await sendEmail({
    to: email,
    subject: '🔐 Vérifiez votre adresse email - Marketplace',
    html: htmlContent,
    text: textContent
  });
}

/**
 * Envoyer un email de contact
 */
export async function sendContactEmail(name, email, message) {
  console.log('📧 Préparation email de contact de:', email);
  
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .header h2 { margin: 0; }
        .field { margin-bottom: 15px; }
        .field-label { font-weight: bold; color: #667eea; margin-bottom: 5px; }
        .field-value { background: #f9f9f9; padding: 10px; border-left: 3px solid #667eea; border-radius: 4px; word-wrap: break-word; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #999; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>📧 Nouveau message de contact</h2>
        </div>
        
        <div class="field">
          <div class="field-label">👤 Nom:</div>
          <div class="field-value">${name}</div>
        </div>

        <div class="field">
          <div class="field-label">📧 Email:</div>
          <div class="field-value">${email}</div>
        </div>

        <div class="field">
          <div class="field-label">💬 Message:</div>
          <div class="field-value">${message.replace(/\n/g, '<br>')}</div>
        </div>

        <div class="footer">
          <p>Cet email a été envoyé via le formulaire de contact.</p>
          <p>Date: ${new Date().toLocaleString('fr-FR')}</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const textContent = `
    Nouveau message de contact
    
    Nom: ${name}
    Email: ${email}
    
    Message:
    ${message}
    
    Date: ${new Date().toLocaleString('fr-FR')}
  `;

  return await sendEmail({
    to: emailConfig.contactEmail,
    subject: `📧 Nouveau message de ${name}`,
    html: htmlContent,
    text: textContent,
    replyTo: email
  });
}