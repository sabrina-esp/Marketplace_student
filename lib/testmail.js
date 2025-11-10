import nodemailer from 'nodemailer';

export async function POST(req) {
  try {
    const { name, email, message } = await req.json();

    // Validation
    if (!name || !email || !message) {
      return Response.json(
        { success: false, message: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }

    // Configuration du transporteur
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

    // Template HTML
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 20px; border-radius: 8px; }
          .header { background: #667eea; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
          .content { background: white; padding: 20px; border-radius: 8px; }
          .field { margin-bottom: 20px; }
          .label { font-weight: bold; color: #667eea; }
          .value { margin-top: 5px; padding: 10px; background: #f0f0f0; border-radius: 4px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Nouveau message de contact</h2>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">Nom :</div>
              <div class="value">${name}</div>
            </div>
            <div class="field">
              <div class="label">Email :</div>
              <div class="value">${email}</div>
            </div>
            <div class="field">
              <div class="label">Message :</div>
              <div class="value">${message}</div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Envoyer l'email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `Nouveau message de contact de ${name}`,
      html: htmlContent,
      text: `Nom: ${name}\nEmail: ${email}\nMessage: ${message}`
    });

    return Response.json(
      { success: true, message: 'Email envoyé avec succès!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur:', error);
    return Response.json(
      { success: false, message: 'Erreur lors de l\'envoi de l\'email' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return Response.json({ success: true }, { status: 200 });
}